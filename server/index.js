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
  if (id <= 0) throw new ClientError(`Product id ${id} is invalid`, 400);
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
    SELECT "price"
      FROM "products"
     WHERE "productId" = $1;
  `, [pid])
    .then(result => {
      const row = result.rows[0];
      if (!row) throw new ClientError(`Product does not exist at id: ${pid}`, 404);
      if (req.session.cartId) {
        return {
          cartId: req.session.cartId,
          price: row.price
        };
      }
      return db.query(`
        INSERT INTO "carts" ("cartId", "createdAt")
             VALUES (DEFAULT, DEFAULT)
          RETURNING "cartId", $1 AS "price";
      `, [row.price]);
    })
    .then(result => {
      const row = result.rows ? result.rows[0] : result;
      req.session.cartId = row.cartId;
      return db.query(`
        INSERT INTO "cartItems" ("cartId", "productId", "price")
             VALUES ($1, $2, $3)
          RETURNING "cartItemId";
      `, [row.cartId, pid, row.price]);
    })
    .then(result => {
      const row = result.rows[0];
      return db.query(`
        SELECT "c"."cartItemId",
               "c"."price",
               "p"."productId",
               "p"."image",
               "p"."name",
               "p"."shortDescription"
          FROM "cartItems" AS "c"
          JOIN "products" AS "p" USING ("productId")
         WHERE "cartItemId" = $1;
      `, [row.cartItemId]);
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
             "c"."price",
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

app.delete('/api/cart/', (req, res, next) => {
  const cid = req.session.cartId;
  const pid = req.body.productId;
  const qty = req.body.quantity;
  if (!pid || !Number(qty)) throw new ClientError('Product id required', 400);
  else if (!qty || !Number(qty)) throw new ClientError('Quantity required', 400);
  else if (pid <= 0) throw new ClientError(`Product id ${pid} is invalid`, 400);
  else if (qty <= 0) throw new ClientError(`Quantity ${pid} is invalid`, 400);
  db.query(`
  DELETE FROM "cartItems"
        WHERE "cartItemId" IN (
            SELECT "cartItemId"
              FROM "cartItems"
             WHERE "productId" = $1 AND "cartId" = $2
             ORDER BY "cartItemId" DESC
             LIMIT $3
          );
  `, [pid, cid, qty])
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

app.post('/api/orders', (req, res, next) => {
  const cid = req.session.cartId;
  const session = req.session;
  const { name, creditCard, shippingAddress } = req.body;
  if (!cid) throw new ClientError('Cart id required', 400);
  else if (!name) throw new ClientError('Name required', 400);
  else if (!creditCard) throw new ClientError('Credit card required', 400);
  else if (!shippingAddress) throw new ClientError('Shipping address required', 400);
  db.query(`
    INSERT INTO "orders" ("cartId", "name", "creditCard", "shippingAddress")
         VALUES ($1, $2, $3, $4)
      RETURNING *;
  `, [cid, name, creditCard, shippingAddress])
    .then(result => {
      session.cartId = null;
      delete session.cartId;
      res.status(201).json(result.rows[0]);
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
