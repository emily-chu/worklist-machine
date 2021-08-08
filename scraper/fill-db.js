const mongo = require('../connection');
const https = require('https')
const fs = require('fs')

async function uploadCourses() {
  const client = await mongo.wakeDb();
  const collection = client.db('ubc-vancouver').collection('2021');
  askApi('/course').then(resp => {
    collection.insertMany(resp.courses).then(() => { client.close() });
    collection.up
    // console.log(data.courses[0]);
  });
}

/**
 * attempting to do this in a respectable amount of requests to Liang's api lol
 */
async function uploadSectionsToCourses() {
  const client = await mongo.wakeDb();
  const collection = client.db('school-ubc-vancouver').collection('2021');

  // nvm api went down
  fs.readFile('sections.json', 'utf8', (err, data) => {
    if (err) return console.log(err)
    let js = JSON.parse(data);
    js.forEach((sec, idx) => {
      // if (idx <= 17654) return; // lol free tier mongo iguess
      console.log(idx + ': adding section: ' + sec.name);
      collection.findOneAndUpdate({ subject: sec.subject, course: sec.course }, { $push: { sections: sec } });
    });
  });

  // const bigData = await askApi('/sectionInfo');
  // bigData.forEach((sec, idx) => {
  //   // push section to course.sections, creating .sections if necessary
  //   console.log(idx + ': adding section: ' + sec.name);
  //   collection.findOneAndUpdate({ subject: sec.subject, course: sec.course }, { $push: { sections: sec } });
  // });
}

async function unsetSections() {
  const client = await mongo.wakeDb();
  const collection = client.db('school-ubc-vancouver').collection('2021');
  collection.updateMany({}, { $unset: { sections: 1 } });
}

/**
 * @param {string} path e.g. '/section/cpsc/221'
 * @returns {Promise<object>|Promise<Array>}
 */
function askApi(path) {
  const reqspec = {
    hostname: 'api.ubccourses.com',
    port: 443,
    path: path,
    method: 'GET'
  }
  console.log('sending a ' + reqspec.method + ' req to ' + reqspec.hostname + reqspec.path);
  return new Promise((resolve, reject) => {
    const req = https.request(reqspec, resp => {
      let data = ''
      resp.on('data', chunk => { data += chunk; });
      resp.on('end', () => { resolve(JSON.parse(data)); });
    }).on('error', err => {
      console.error(err);
      reject(err);
    });
    req.end();
  });
}

async function wipeCollection(name) {
  const client = await mongo.wakeDb();
  let collection = client.db('ubc-vancouver').collection(name);
  return collection.deleteMany({}).then(() => { client.close() });
}

/**
 * moves all courses from one place to another, 
 * slow, but good for inserting only if not present
 */
async function transfer() {
  const client = await mongo.wakeDb();
  // const source = client.db('university-of-british-columbia').collection('dumping-ground');
  const source = client.db('ubc-vancouver').collection('2021');
  const destination = client.db('school-ubc-vancouver').collection('2021');

  source.find().forEach(doc => {
    destination.findOne({ _id: doc._id }).then(x => {
      if (!x) {
        console.log(doc.name);
        destination.insertOne(doc)
      }
    })
    return;
  })
}

function main() {
  // uploadCourses();
  // wipeCollection('2021');
  uploadSectionsToCourses();
  // unsetSections();
    
}

main();