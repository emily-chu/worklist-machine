require('dotenv').config();
const uri = process.env.ATLAS_URI;
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * wakeDb().then(client => something(client))
 * caller is responsible for closing connection
 * @returns {Promise<MongoClient>}
 */
function wakeDb() {
  return new Promise((resolve, reject) => {
    try {
      client.connect((err, mongoClient) => {
        if (err) {
          console.error('Error connecting to database: ');
          console.log(err);
          // reject(err);
        }
        resolve(mongoClient);
      });
    } catch (err) {
      console.error('ur code prob doesnt work');
      console.error(err)
    }
  })
}

module.exports = {
  wakeDb,
  schoolPrefix: 'school-',
}