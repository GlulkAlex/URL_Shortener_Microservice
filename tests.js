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
/*** application modules end ***/

/*** tests ***/
var test_1 = function(
  //urls//:list
  hosts//:list
) {
  var hosts_Length = hosts.length;
  var host_Index = 0;
  var host;

  for (host_Index in hosts) {
    host = hosts[host_Index];
    //validate_Host_Name
    console.log("is ", host,"a valid name:", host_Name_Validator.is_Host_Name_Valid(host));
  }
}
/*** tests end ***/

//***#####################################################################***//
/*** unit test (main) ***/
test_1(
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
test_1(
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