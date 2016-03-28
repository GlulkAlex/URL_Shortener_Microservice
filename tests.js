"use strict";
/*** Node.js modules ***/
// a core module
const assert = require('assert');
// npm module
//var
const MongoClient = require('mongodb').MongoClient;
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
//.get_Short_Link()
const link_Gen = require('./short_link_generator.js');//.short_Link_Generator;
//generate_Unique_Short_Link
// started hole app, not just import designated functions
//const db_Helpers = require('./app.js');
//exports.make_Unique_Link
const db_Helpers = require('./db_Helpers.js');
/*** application modules end ***/

/*** helpers ***/
// for
// col.insertMany([{a:1}, {a:2}], function(err, r) {
// r.insertedCount
function make_Links_Documents(
  size//:int
)/* => list of obj */ {
  "use strict";

  var result;
  var results = [];
  var loop_Counter = 0;

  for (;loop_Counter < size;loop_Counter++){
    //{"original_url":"original_Link_1","short_url":""}
    // ??? WTF ???
    // TODO : test short_Link_Generator for ''
    results.push(
      {
        "original_url": "original_Link_" + loop_Counter,
        "short_url": link_Gen.get_Short_Link(loop_Counter)
      }
    );
  }

  return results;
}

function clear_Links(mongoLab_URI, collection_Name){
  "use strict";

  var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
  collection_Name = collection_Name ? collection_Name : 'tests';

  //db.collections(function(err, collections) {
  // ? Promise <pending> ?
  return Promise.resolve(
    connection
      .then((db) => {
        // Create a collection we want to drop later
        // Returns:
        // the new Collection instance if not in strict mode
        //var collection = db.collection(collection_Name);
        //var collection =
        db.collection(
          collection_Name,
          {strict: true},
          (err, col) => {
            if (err) {
              console.log("collection:", collection_Name, " not exist in db");
              console.log("nothing to drop from db");
              db.close();

              //return undefined;
            } else {
              console.log("collection:", collection_Name, " exist in db");
              console.log("collection:", collection_Name, " about to drop from db");
              // Drop the collection
              //var drop = collection.drop();//function(err, reply) {
              var drop = db.dropCollection(collection_Name);//, function(err, result) {

              drop
                .then((reply) => {
                  // Verify that the collection is gone
                  //db.listCollections({name:collection_Name}).toArray().then((names) => {
                  //  assert.equal(0, names.length);
                  console.log("drop reply is:", reply);
                  // Let's close the db
                  db.close();
                }
                ).catch((err) => {
                  // MongoError: ns not found
                  console.log("drop err:", err.stack);}
              );

              //return col;
            }
          }
        );

      }
      ).catch((err) => {console.log("connection err:", err.stack);}
    )
  );
};

function add_Docs(
  documents,//:list of obj
  collection_Name//:str
)/* => Promise */{
  "use strict";

  var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
  collection_Name = collection_Name ? collection_Name : 'tests';

  //db.collections(function(err, collections) {
  // ? Promise <pending> ?
  return Promise.resolve(
    connection
      .then((db) => {
        // Create a collection we want to drop later
        // Returns:
        // the new Collection instance if not in strict mode
        var collection = db.collection(collection_Name);

        collection
          .insertMany(documents)//, function(err, r) {
          .then((result) => {
              console.log("added:", result.insertedCount, "documents to ", collection_Name);
              // Let's close the db
              db.close();
            }
            ).catch((err) => {
              // MongoError: ns not found
              console.log("insertMany err:", err.stack);}
          );

      }
      ).catch((err) => {console.log("connection err:", err.stack);}
    )
  );
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
// DONE 1.drop collection
// DONE 2.dummy data generator
// DONE 3.insert generated data
var test_2 = function(
  //urls//:list
) {
  "use strict";

  var result;
  var results = [];

  console.log("mongoLab_URI is:", mongoLab_URI);
  results = make_Links_Documents(7);
  console.log("results: %j", results);
  //"tests"
  var clear = clear_Links(mongoLab_URI, "tests");
  console.log("typeof clear:", (typeof clear));
  console.log("clear instanceof Promise:", (clear instanceof Promise));

  clear
    .then(() => {
      add_Docs(
        results,//:list of obj
        "tests"//:str
      );
    }
    ).catch((err) => {console.log("clear.then err:", err.stack);}
  );


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
