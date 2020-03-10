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
  const pid = Number(req.body.productId);
  const cid = Number(req.body.cartId);
  if (!pid || pid <= 0) throw new ClientError(`Product id ${pid} is invalid`, 400);
  else if (cid && cid <= 0) throw new ClientError(`Cart id ${cid} is invalid`, 400);
  else {
    db.query(`
      SELECT "price"
        FROM "products"
       WHERE "productId" = $1;
    `, [pid])
      .then(result => {
        const row = result.rows[0];
        if (!row) throw new ClientError(`Product does not exist at id: ${pid}`, 404);
        if (cid) { // asserting cid is valid
          return db.query(`
            SELECT "carts"."cartId",
                   $2 AS "price"
              FROM "carts"
             WHERE "cartId" = $1;
          `, [cid, row.price]);
        } else {
          return db.query(`
            INSERT INTO "carts" ("cartId", "createdAt")
                 VALUES (DEFAULT, DEFAULT)
              RETURNING "cartId", $1 AS "price";
          `, [row.price]);
        }
      })
      .then(result => {
        const row = result.rows[0];
        if (!row) throw new ClientError(`Cart does not exist at id: ${cid}`, 404);
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
           WHERE "c"."cartItemId" = $1
        `, [row.cartItemId]);
      })
      .then(result => {
        res.json(result.rows[0]).send(201);
      })
      .catch(err => next(err));
  }
});

app.get('/api/cart', (req, res, next) => {
  const cid = (req.body.cartId);
  if (!cid || cid <= 0) throw new ClientError(`Cart id ${cid} is invalid`, 400);
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
      if (result.rows.length === 0) throw new ClientError(`Cart does not exist/is empty at id: ${cid}`, 404);
      res.json(result.rows);
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
