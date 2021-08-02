const express = require('express');
const cors = require('cors');
const db = require('./connection');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/schools', function (req, res, next) {
  db.wakeDb().then(mongo => {
    return mongo.db().admin().listDatabases({
      listDatabases: 1,
      nameOnly: true,
    });
  }).then(doc => {
    res.send({
      schools: doc.databases
        .filter(sch => sch.name.startsWith(db.schoolPrefix))
        .map(sch => ({ 
          dbName: sch.name, 
          name: sch.name.slice(db.schoolPrefix.length) 
          // todo: valid semester list
        }))
    });
  }).catch(next);
});

app.get('/:school/sessions', function (req, res, next) {
  db.wakeDb().then(mongo => {
    return mongo.db(db.schoolPrefix + req.params.school).listCollections().toArray();
  }).then(resp => {
    res.send({
      school: req.params.school,
      sessions: resp.map(ses => ({ name: ses.name }))
    });
  }).catch(next);
});

/**
 * maybe make this a get with a fat query string idk
 * @param req.params.school db name minus prefix, e.g. 'ubc-vancouver'
 * @param req.params.session collection name
 * @param {name: string, section?: string}[] req.body.courses
 */
app.post('/:school/:session/courses', function (req, res, next) {
  const query = {
    name: { $in: req.body.courses.map(c => c.name) }
  }
  const projection = {
    // todo: use this to include only necessary fields
  }
  db.wakeDb().then(mongo => {
    return mongo.db(db.schoolPrefix + req.params.school)
      .collection(req.params.session)
      .find(query)
      .toArray()
      .then(x => {
        console.log(x.length)
        res.send(x);
      })
  }).catch(next);
})

/**
 * error handler called on .catch(next)
 */
app.use(function (err, req, res, next) {
  console.error(err);
  process.env.DEV ?
    res.status(500).json({ error: err, stack: err.stack })
    : res.status(500).send({ error: 'Error in server.js!' })
});

// Starts the server
app.listen(port, function () {
  console.log(`Server is running on port: ${port}`);
});
