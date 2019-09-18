const { Pool, Client } = require('pg');
const connectionString = 'postgresql://localhost:5432/mydb';

// const pool = new Pool({
//   connectionString: connectionString,
// });
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// });
const client = new Client({
  connectionString: connectionString,
});
client.connect(err => {
  if (err) {
    console.error(err);
  } else {
    console.log('connection successful!');
  }
});

const getReviews = (req, cb) => {
  client.query(`SELECT *  FROM reviews WHERE itemid = ${req.query.itemID};`, (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      // Sanitizing response to remove data from other users
      let queryUser = req.query.user;
      res.rows.forEach(row => {
        if (row.foundhelpful.includes(queryUser)) {
          row.foundhelpful = [queryUser];
        } else {
          row.foundhelpful = [];
        }
      });

      cb(null, res);
    }
  });
};

const seedPost = (cb) => {
  client.query(`COPY reviews (itemid, author, avatarurl, rating, title, text, date, helpfulcount, foundhelpful) FROM '/Users/Jeffrey/Desktop/module-reviews/output2.csv' DELIMITERS '|' CSV HEADER;`, (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb('successful seed', null);
    }
  });
};

module.exports = { getReviews, seedPost };