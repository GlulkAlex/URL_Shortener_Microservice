"use strict";
/*** Node.js modules ***/
// a core module
const assert = require('assert');
/*** Node.js modules end ***/

/*** config ***/
// If X.json is a file, parse X.json to a JavaScript Object.
const env = require('./.env.json');
const mongoLab_URI = (
  // must be on `.env` file or
  // in heroku config
  // it is possible
  // to use the same config var
  // in both local and Heroku environments
  env.TEST_MONGODB.value ||
  process.env.TEST_MONGODB ||
  process.argv[3] ||
  "mongodb://localhost:27017/data_uri"
);
/*** config end ***/

/*** application modules ***/
const host_Name_Validator = require('./host_Name_Validator.js');
//generate_Unique_Short_Link
// started hole app, not just import designated functions
//const db_Helpers = require('./app.js');
//exports.make_Unique_Link
const db_Helpers = require('./db_Helpers.js');
/*** application modules end ***/

/*** helpers ***/
function make_Links_Documents(
  size//:int
)/* => list */ {
  "use strict";

  var result;
  var results = [];

  return;
}

function clear_Links(mongoLab_URI, collection_Name){
//var
const MongoClient = require('mongodb').MongoClient;

var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
collection_Name = 'tests';

connection
  .then((db) => {
    // Create a collection we want to drop later
    var collection = db.collection(collection_Name');

    // Drop the collection
    var drop = collection.drop();//function(err, reply) {

    drop
      .then((reply) => {
        console.log("drop reply is:", reply);
        // Let's close the db
        db.close();
      });

  });
};
/*** helpers end ***/

/*** tests ***/
var test_1 = function(
  //urls//:list
  hosts//:list
) {
  "use strict";

  var hosts_Length = hosts.length;
  var host_Index = 0;
  var host;
  var results = [];
  var result;

  //for (host_Index in hosts) {
  //  host = hosts[host_Index];
  hosts.forEach((host) => {
    //validate_Host_Name
    result = host_Name_Validator.is_Host_Name_Valid(host);
    results.push(result);
    console.log("is ", host,"a valid name:", result);
  }
  );

  return results;
}
// TODO 1.drop collection
// TODO 2.dummy data generator
// TODO 3.insert generated data
var test_2 = function(
  //urls//:list
) {
  "use strict";

  var result;
  var results = [];

  console.log("mongoLab_URI is:", mongoLab_URI);


  return results;
}
/*** tests end ***/

//***#####################################################################***//
/*** unit test (main) ***/
var actual_Results;
var expected_Results;

if (
  //true
  false
) {
  // case 1: valid host names
  actual_Results = test_1(
    [
      "mongodb.github.io",
      "node-mongodb-native.api",
      "en.wikipedia.org",
      "nodejs.org",
      "github.com",
      "www.w3schools.com",
      "www.xn----7sbajojiclh2ahkc2br7fc0m.xn--p1ai"
    ]
  );
  expected_Results = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
  ];
  //assert.equal({a: {b: 1}}, {a: {b: 1}});
  //AssertionError: [ true, true, true, true, true, true, true ] == [ true, true, true, true, true, true, true ]
  assert.deepEqual(actual_Results, expected_Results);
  // case 2: invalid host names
  actual_Results = test_1(
    [
      "mongodb..github.io",
      "-node-mongodb-native.api",
      "en.wikipedia.org-",
      "nodejsorg",
      "?github.com",
      "www.-w3schools.com",
      "www.xn----7sbajojiclh2ahkc2br7fc0m.xn--p1ai%"
    ]
);
expected_Results = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
];
assert.deepEqual(actual_Results, expected_Results);
}
if (
  true
  //false
) {
  // case 1: empty collection, no duplicate hits
  actual_Results = test_2();
  // case 2: non-empty collection, no duplicate hits for field of same length
  //actual_Results = test_2();
  // case 3: non-empty collection, high probability of duplicate hits for field of same length
  //actual_Results = test_2();
}
