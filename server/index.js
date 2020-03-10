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
  else {
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
  }
});

app.post('/api/cart', (req, res, next) => {
  const pid = req.body.productId;
  if (!pid) throw new ClientError('Product id required', 400);
  else if (!Number(pid) || pid <= 0) throw new ClientError(`Product id ${pid} is invalid`, 400);
  else {
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
  }
});

app.get('/api/cart', (req, res, next) => {
  const cid = req.session.cartId;
  const ciid = req.body.cartItemId;
  let query;
  if (!cid) res.json([]);
  else if (ciid && (!Number(ciid) || ciid <= 0)) throw new ClientError(`Cart item id ${ciid} is invalid`, 400);
  else {
    if (ciid) {
      query = () => db.query(`
        SELECT "c"."cartItemId",
               "c"."price",
               "p"."productId",
               "p"."image",
               "p"."name",
               "p"."shortDescription"
          FROM "cartItems" AS "c"
          JOIN "products" AS "p" USING ("productId")
         WHERE "cartItemId" = $1 AND "cartId" = $2;
    `, [ciid, cid]);
    } else {
      query = () => db.query(`
        SELECT "c"."cartItemId",
               "c"."price",
               "p"."productId",
               "p"."image",
               "p"."name",
               "p"."shortDescription"
          FROM "cartItems" AS "c"
          JOIN "products" AS "p" USING ("productId")
         WHERE "cartId" = $1;
    `, [cid]);
    }
    query()
      .then(result => {
        res.json(result.rows);
      })
      .catch(err => next(err));
  }
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
