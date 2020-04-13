require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('SELECT \'successfully connected\' AS "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/visit-check', (req, res, next) => {
  const sess = req.session;
  if (!sess.visitCount) sess.visitCount = 1;
  else ++sess.visitCount;
  res.json({ visitCount: sess.visitCount });
});

app.get('/api/products', (req, res, next) => {
  db.query(`
    SELECT "productId",
           "name",
           "price",
           "image",
           "shortDescription"
      FROM "products";
  `).then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/products/:id', (req, res, next) => {
  const id = req.params.id;
  if (!Number(id) || id <= 0) throw new ClientError(`Product id ${id} is invalid`, 400);
  db.query(`
    SELECT *
      FROM "products"
     WHERE "productId" = $1;
  `, [id])
    .then(result => {
      const row = result.rows[0];
      if (!row) throw new ClientError(`Product does not exist at id: ${id}`, 404);
      else res.json(row);
    }).catch(err => next(err));
});

app.post('/api/cart', (req, res, next) => {
  const pid = req.body.productId;
  if (!pid) throw new ClientError('Product id required', 400);
  else if (!Number(pid) || pid <= 0) throw new ClientError(`Product id ${pid} is invalid`, 400);
  db.query(`
    SELECT 1
      FROM "products"
     WHERE "productId" = $1;
  `, [pid])
    .then(result => {
      if (!result.rowCount) throw new ClientError(`Product does not exist at id: ${pid}`, 404);
      if (req.session.cartId) return { cartId: req.session.cartId };
      return db.query(`
        INSERT INTO "carts" ("cartId", "createdAt")
             VALUES (DEFAULT, DEFAULT)
          RETURNING "cartId";
      `);
    })
    .then(result => {
      const cid = (result.rowCount ? result.rows[0] : result).cartId;
      req.session.cartId = cid;
      return db.query(`
        WITH "inserted_row" AS (
          INSERT INTO "cartItems" ("cartId", "productId", "quantity")
               VALUES ($1, $2, 1)
          ON CONFLICT ON CONSTRAINT uc_productId DO UPDATE
                  SET "quantity" = "cartItems"."quantity" + 1
            RETURNING *
        )
        SELECT "c"."cartItemId",
               "c"."quantity",
               "p"."price",
               "p"."productId",
               "p"."image",
               "p"."name",
               "p"."shortDescription"
          FROM "inserted_row" AS "c"
          JOIN "products" AS "p" USING ("productId");
      `, [cid, pid]);
    })
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/cart', (req, res, next) => {
  const cid = req.session.cartId;
  if (!cid) res.json([]);
  else {
    db.query(`
      SELECT "c"."cartItemId",
             "c"."quantity",
             "p"."price",
             "p"."productId",
             "p"."image",
             "p"."name",
             "p"."shortDescription"
        FROM "cartItems" AS "c"
        JOIN "products" AS "p" USING ("productId")
       WHERE "cartId" = $1;
    `, [cid])
      .then(result => {
        res.json(result.rows);
      })
      .catch(err => next(err));
  }
});

app.patch('/api/cart', (req, res, next) => {
  const cid = req.session.cartId;
  const ciid = req.body.cartItemId;
  const qty = req.body.quantity;
  if (!ciid || !Number(ciid)) throw new ClientError('Cart item id required', 400);
  else if (!qty || !Number(qty)) throw new ClientError('Quantity required', 400);
  else if (ciid <= 0) throw new ClientError(`Cart item id ${ciid} is invalid`, 400);
  else if (qty <= 0) throw new ClientError(`Quantity ${qty} is invalid`, 400);
  db.query(`
  WITH "updated_row" AS (
       UPDATE "cartItems" AS "ciu"
          SET "quantity" = $1
        WHERE "ciu"."cartId" = $2 AND "ciu"."cartItemId" = $3
    RETURNING *
  )
  SELECT "c"."cartItemId",
         "c"."quantity",
         "p"."price",
         "p"."productId",
         "p"."image",
         "p"."name",
         "p"."shortDescription"
    FROM "updated_row" AS "c"
    JOIN "products" AS "p" USING("productId");
  `, [qty, cid, ciid])
    .then(result => {
      if (!result.rowCount) throw new ClientError(`Cart item id ${ciid} is invalid`, 400);
      res.status(202).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.delete('/api/cart/', (req, res, next) => {
  const ciid = req.body.cartItemId;
  if (!ciid || !Number(ciid)) throw new ClientError('Cart item id required', 400);
  else if (ciid <= 0) throw new ClientError(`Cart item id ${ciid} is invalid`, 400);
  db.query(`
       DELETE FROM "cartItems"
             WHERE "cartItemId" = $1 AND "cartId" = $2
  `, [ciid, req.session.cartId])
    .then(data => {
      if (data.rowCount === 0) throw new ClientError(`Cart item id ${ciid} is invalid`, 400);
      res.sendStatus(204);
    })
    .catch(err => next(err));
});

app.post('/api/orders', (req, res, next) => {
  const cid = req.session.cartId;
  const session = req.session;
  const { name, creditCard, shippingAddress } = req.body;
  if (!name) throw new ClientError('Name required', 400);
  else if (!creditCard) throw new ClientError('Credit card required', 400);
  else if (!shippingAddress) throw new ClientError('Shipping address required', 400);
  db.query(`
    WITH "orders_cte" AS (
      INSERT INTO "orders" ("cartId", "name", "creditCard", "shippingAddress")
           VALUES ($1, $2, $3, $4)
    )
    SELECT "c"."productId",
           "c"."quantity",
           "p"."name",
           "c"."quantity" * "p"."price" AS "total"
      FROM "cartItems" AS "c"
      JOIN "products" AS "p" USING ("productId")
     WHERE "c"."cartId" = $1;
  `, [cid, name, creditCard, shippingAddress])
    .then(result => {
      session.cartId = null;
      delete session.cartId;
      res.status(201).json(result.rows);
    })
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
