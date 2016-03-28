"use strict";
/*** Node.js modules ***/
const assert = require('assert');
/*** Node.js modules end ***/
/*** config ***/
const mongoLab_URI = (
  // must be on `.env` file or
  // in heroku config
  // it is possible
  // to use the same config var
  // in both local and Heroku environments
  process.env.TEST_MONGODB ||
  process.argv[3] ||
  "mongodb://localhost:27017/data_uri"
);
/*** config end ***/
/*** application modules ***/
const host_Name_Validator = require('./host_Name_Validator.js');
//generate_Unique_Short_Link
const db_Helpers = require('./app.js');
/*** application modules end ***/

/*** tests ***/
var test_1 = function(
  //urls//:list
  hosts//:list
) {
  var hosts_Length = hosts.length;
  var host_Index = 0;
  var host;
  var results = [];
  var result;

  for (host_Index in hosts) {
    host = hosts[host_Index];
    //validate_Host_Name
    result = host_Name_Validator.is_Host_Name_Valid(host);
    results.push(result);
    console.log("is ", host,"a valid name:", result);
  }


  return results;
}
var test_2 = function(
  //urls//:list
  hosts//:list
) {
  var hosts_Length = hosts.length;
  var host_Index = 0;
  var host;
  var results = [];
  var result;

  for (host_Index in hosts) {
    host = hosts[host_Index];
    //validate_Host_Name
    result = host_Name_Validator.is_Host_Name_Valid(host);
    results.push(result);
    console.log("is ", host,"a valid name:", result);
  }


  return results;
}
/*** tests end ***/

//***#####################################################################***//
/*** unit test (main) ***/
var actual_Results;

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
var expected_Results = [
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
