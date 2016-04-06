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
//try {pak = require('package.json');}catch(err){pak = null;} ? pak : "fail";
//const
var env = () => {
  try {
    return require('./.env.json');
  } catch(err) {
    console.warn("config file missing, so as actual connection info too");

    return {
      "TEST_MONGODB": {
        "value": false
      }
      ,"DEBUG_MODE": {
        "value": false
      }
    };
  }
}();
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
//*** config end ***//

//*** application modules ***//
const host_Name_Validator = require('./host_Name_Validator.js');
//.get_Short_Link()
//.choose_Options()
//.get_Short_Link_Length()
const link_Gen = require('./short_link_generator.js');//.short_Link_Generator;
//generate_Unique_Short_Link
// started hole app, not just import designated functions
//const db_Helpers = require('./app.js');
//exports.make_Unique_Link
const db_Helpers = require('./db_Helpers.js');
const comparator = require('./comparator.js');
//*** application modules end ***//

//*** helpers ***//
// DONE create unique fields indexes
// DONE query for (check if) field value in the list
// DONE but not exactly extract info about successfully inserted documents from 'insertMany' result
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
    // DONE : test short_Link_Generator for ''
    results.push(
      {
        "original_url": "original_Link_" + loop_Counter,
        "short_url": link_Gen.get_Short_Link(loop_Counter)
      }
    );
  }

  return results;
}

/*** helpers end ***/

/*** tests ***/
var actual_Results;
var expected_Results;
// case 1: valid host names
var hosts_case_1 = [
  "mongodb.github.io",
  "node-mongodb-native.api",
  "en.wikipedia.org",
  "nodejs.org",
  "github.com",
  "www.w3schools.com",
  "www.xn----7sbajojiclh2ahkc2br7fc0m.xn--p1ai"
];
expected_Results = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
];
// case 2: invalid host names
var hosts_case_2 = [
  "mongodb..github.io",
  "-node-mongodb-native.api",
  "en.wikipedia.org-",
  "nodejsorg",
  "?github.com",
  "www.-w3schools.com",
  "www.xn----7sbajojiclh2ahkc2br7fc0m.xn--p1ai%"
];
var expected_Results_case_2 = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
];
var test_1 = function(description){
  "use strict";
  // curred
  return function(
    hosts//:list of str
    ,expected_Results//:list of bool
  )/* => list of bool */ {
    "use strict";
    console.log(description);

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
        console.log("is ", host,"a valid host name:", result);
      }
    );

    //assert.equal({a: {b: 1}}, {a: {b: 1}});
    //AssertionError: [ true, true, true, true, true, true, true ] == [ true, true, true, true, true, true, true ]
    //actual_Results = results
    assert.deepEqual(results, expected_Results);

    return results;
  };
}("test 1: must check for a valid host name")
//(hosts_case_1, expected_Results)
//(hosts_case_2, expected_Results_case_2)
;

// DONE 1.drop collection
// DONE 2.dummy data generator
// DONE 3.insert generated data
var docs_List = [
  {"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_1", "short_url" : "yY"}
];
// case 2: some docs -> unique
var bulk_Docs_List = [
  { "insertOne": { "document": {"original_url" : "o_L_0", "short_url" : "a"} } }
  ,{ "insertOne": { "document": {"original_url" : "o_L_0", "short_url" : "a"} } }
  ,{ "insertOne": { "document": {"original_url" : "o_L_0", "short_url" : "a"} } }
  ,{ "insertOne": { "document": {"original_url" : "o_L_1", "short_url" : "yY"} } }
];
// case 2: some docs -> unique
var bulk_Docs_List_2 = [
  { "insertOne": { "document": {"original_url" : "o_L_0", "short_url" : "b"} } }
  ,{ "insertOne": { "document": {"original_url" : "o_L_2", "short_url" : "a"} } }
  ,{ "insertOne": { "document": {"original_url" : "o_L_3", "short_url" : "c"} } }
  ,{ "insertOne": { "document": {"original_url" : "o_L_1", "short_url" : "yY"} } }
];
var test_2 = function(description){
  "use strict";
  // curred
  return function(
    mongoLab_URI//:str
    ,collection_Name//:str
    ,documents//:list of obj
    //,indexes_List//:list of str
  )/* => Promise ? */ {
    "use strict";
    console.log(description);

    var result;
    var results = [];
    var docs_Number = 7;
    //var documents = [];

    //console.log("mongoLab_URI is:", mongoLab_URI);
    //documents = make_Links_Documents(docs_Number);
    console.log("documents: %j", documents);
    if (Array.isArray(documents)) {
      if (documents.length > 0) {
      } else {
        return results;
      }
      //"tests"
      //var clear = clear_Links(mongoLab_URI, "tests");
      //console.log("typeof clear:", (typeof clear));
      //console.log("clear instanceof Promise:", (clear instanceof Promise));
      //var connection_Promise = MongoClient.connect(mongoLab_URI);
      var collection_Promise = Promise.resolve(db_Helpers.get_Collection(
        mongoLab_URI//:str
        ,collection_Name
        ,null
        ,MongoClient
        )
      );

      //connection_Promise
      //  .then((db) => {
      collection_Promise
        .then((collection) => {
            !(env.DEBUG_MODE.value) || console.log("collection: %j", collection);
            db_Helpers.add_Docs(
              documents,//:list of obj
              collection
            );
          }
        ).catch((err) => {
          !(env.DEBUG_MODE.value) || console.log("collection_Promise.then err:", err.code);
          console.log(err.stack);
        }
      );
    }


    //return results;
  };
//}("test 2: must drop existing collection, create new one & insert list of documents to it in DB");
}("test 2: must insert list of documents to collection in DB")
//(mongoLab_URI, "tests", docs_List)
//(mongoLab_URI, "tests", bulk_Docs_List)
;

var test_2_1 = function(description){
  "use strict";
  // curred
  return function(
    MongoClient//: MongoClient obj <- explicit
    ,mongoLab_URI//:str
    ,collection_Name//:str
    ,documents//:list of obj
  )/* => Promise ? */ {
    "use strict";
    console.log(description);

    var result;
    var results = [];

    //console.log("mongoLab_URI is:", mongoLab_URI);
    !(env.DEBUG_MODE.value) || console.log("documents: %j", documents);
    var db_Promise = //Promise
      //.resolve(
        db_Helpers
          .bulk_Docs_Insert(
            MongoClient//: MongoClient obj <- explicit
            ,mongoLab_URI//: str
            ,collection_Name//: str
            ,documents//:list of obj
        //)
    );
    !(env.DEBUG_MODE.value) || console.log(
      "db_Promise instanceof Promise:", (db_Promise instanceof Promise));

    return db_Promise;
      /*.then((db) => {
          console.log("closing db");
          db.close;
          console.log("db instanceof Promise:", (db instanceof Promise));
          console.log("typeof db:", (typeof db));
        }
      ).catch((err) => {
          console.log("db_Promise.then() err:", err.code);
          console.log(err.stack);
        }*/
    //);


    //return results;
  };
}("test 2.1: must insert list of documents to collection in DB using bulkWrite()")
//(MongoClient, mongoLab_URI, "tests", bulk_Docs_List);
//(MongoClient, mongoLab_URI, "tests", bulk_Docs_List_2)
;

var test_3 = function(
  description//:str
) {
  "use strict";
  console.log(description);
  var result;
  var results = [];
  var filtered = [];

  results = link_Gen.choose_Options.symbols_List;
  console.log("results: %j", results);
  filtered = results.filter((i) => i == "");
  console.log("filtered results: %j", filtered);
  result = filtered.length > 0;


  return result;
}
//("test 3: choose_Options must be non-empty")
;

var test_4 = function(
  description
  ,link_Size//:int
  ,links_Total//:int
) {
  "use strict";
  console.log(description);
  var result;
  var results = [];
  var filtered = [];
  var options_List = link_Gen.choose_Options.symbols_List;
  var generate = link_Gen.get_Short_Link;
  var loop_Counter = 0;
  var link = "";

  for (;loop_Counter < links_Total;loop_Counter++) {
    link = generate(
      link_Size,
      options_List
    );
    results
      .push(
        link
    );
    if (link == "") {
      filtered.push(link);
    }
  }
  //console.log("results: %j", results);
  //filtered = results.filter((i) => i == "");
  console.log("filtered results: %j", filtered);
  result = filtered.length > 0;

  var actual_Results = result;//test_4(1, 150000);
  var expected_Results = false;
  //assert(actual_Results == expected_Results);
  // or (same as)
  assert.equal(actual_Results, expected_Results);

  return result;
}
//("test 4: all links must be non-empty", 1, 150000)//() <- on / off
;

// case 1: all docs -> unique
/*
db.tests.createIndex(
      {short_url: 1}
      ,{
        background: true
        ,unique: true
      }
);
db.tests.insert(
   [
     {"original_url" : "o_L_0", "short_url" : "a"}
    ,{"original_url" : "o_L_1", "short_url" : "b"}
    ,{"original_url" : "o_L_2", "short_url" : "c"}
    ,{"original_url" : "o_L_3", "short_url" : "vV"}
   ],
   { ordered: false }
);
*/
var  docs_Case_1 = [
  {"original_url" : "o_L_1", "short_url" : "a"}
  ,{"original_url" : "o_L_2", "short_url" : "b"}
  ,{"original_url" : "o_L_3", "short_url" : "c"}
  ,{"original_url" : "o_L_4", "short_url" : "vV"}
];
// case 2: some docs -> unique
/*
db.tests.createIndex({"original_url": 1}, {"unique": true});
db.tests.createIndex({"short_url": 1}, {"unique": true});
db.tests.createIndex({"original_url": 1, "short_url": 1}, {"unique": true});
db.tests.insert({"original_url" : "o_L_0", "short_url" : "a"});
db.tests.insert(
   [
     {"original_url" : "o_L_0", "short_url" : "a"}
    ,{"original_url" : "o_L_0", "short_url" : "a"}
    ,{"original_url" : "o_L_1", "short_url" : "c"}
    ,{"original_url" : "o_L_2", "short_url" : "gG"}
   ],
   { ordered: false }
);
*/
var  docs_Case_2 = [
  {"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_1", "short_url" : "c"}
  ,{"original_url" : "o_L_2", "short_url" : "gG"}
];
// case 3: one doc -> unique
/*
db.tests.createIndex({"short_url": 1, "unique": true});
db.tests.insert(
   [
     {"original_url" : "o_L_0", "short_url" : "a"}
    ,{"original_url" : "o_L_0", "short_url" : "a"}
    ,{"original_url" : "o_L_0", "short_url" : "a"}
    ,{"original_url" : "o_L_1", "short_url" : "yY"}
   ],
   { ordered: false }
);
*/
var  docs_Case_3 = [
  {"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_0", "short_url" : "a"}
  ,{"original_url" : "o_L_1", "short_url" : "yY"}
];
var test_5 = function(description){
  "use strict";
  // curred
  return function(
    mongoLab_URI//:str
    ,collection_Name//:str
    ,documents//:list of obj
    //,indexes_List//:list of str
    ,field_Name//:str
    ,MongoClient//: MongoClient obj <- explicit
  )/* => Promise ? */ {
    "use strict";
    console.log(description);

    var result;
    var results = [];

    console.log("mongoLab_URI is:", mongoLab_URI);
    //results = make_Links_Documents(7);
    //console.log("results: %j", results);
    //"tests"
    var clear = db_Helpers.clear_Links(mongoLab_URI, collection_Name, MongoClient);
    //console.log("typeof clear:", (typeof clear));
    //console.log("clear instanceof Promise:", (clear instanceof Promise));

    ///return //Promise.resolve(
    clear
      .then((db) => {
          // ? is it same (one / singleton) db object ?
          var collection_Promise = ///Promise.resolve(

          db_Helpers
            .get_Collection(
              mongoLab_URI,//:str
              collection_Name//:str
              ,db
              ,MongoClient
          ///)
          );
          //console.log("typeof collection:", (typeof collection));
          //console.log("collection instanceof Promise:", (collection instanceof Promise));
          //console.log("collection Promise status:", collection);

          ///return ///Promise.resolve(
          collection_Promise
            .then((collection) => {
                db_Helpers
                  .create_Unique_Index(
                    //"tests"//:str
                    //collection_Name
                    collection
                    //,"short_url"
                    ,field_Name//:str
                )//;
                /**/
                .then((/*col*/) => {
                    // indexes(callback){Promise}
                    // Retrieve all the indexes on the collection.
                    collection
                      .indexes()
                      .then((indexes) => {
                          console.log("collection.indexes:%j", indexes);
                          // Let's close the db
                          // something pending & prevent from properly close(ing) db
                          if (collection.s.db) {
                            console.log("closing collection.s.db");
                            collection.s.db.close();
                          }
                          // TypeError: Cannot read property 'close' of undefined
                          if (db) {
                            console.log("closing db");
                            db.close();
                          }
                        }
                      ).catch((err) => {console.log("collection.indexes.then err:", err.stack);}
                    );
                  }
                )
                /**/
              }
            )
            //.then(Promise.resolve())
            /*
            // ReferenceError: collection is not defined
            .then((col) => {
                // Retrieve all the indexes on the collection.
                collection
                  // TypeError: Cannot read property 'indexes' of undefined
                  .indexes()
                  .then((indexes) => {
                      console.log("collection.indexes:%j", indexes);
                      // Let's close the db
                      // something pending & prevent from properly close(ing) db
                      if (collection.s.db) {
                        console.log("closing collection.s.db");
                        collection.s.db.close();
                      }
                      // TypeError: Cannot read property 'close' of undefined
                      if (db) {
                        console.log("closing db");
                        db.close();
                      }
                    }
                  ).catch((err) => {console.log("collection.indexes.then err:", err.stack);}
                );
              }
            )
            */
            /*
            .then((collection) => {
              add_Docs(
                documents,//:list of obj
                //collection_Name//:str
                collection
              );
              // already handled (within)in above function
              //.catch((err) => {console.log("add_Docs.then err:", err.stack);});
            }
          )*/
          .catch((err) => {
              //console.log("create_Unique_Index.then err:", err.stack);
              console.log("collection_Promise.then err:", err.stack);
            }
          ///)
          );
        }
      ).catch((err) => {console.log("clear.then err:", err.stack);}
    //)
    );


    //return results;
  };
}("test 5: must drop collection, then create unique index in the new collection");
//(mongoLab_URI, "tests", docs_Case_1, "short_url", MongoClient);

var test_6 = function(description){
  "use strict";
  // curred
  return function(
    collection_Name//:str
    //,documents//:list of obj
  )/* => Promise ? */ {
    "use strict";
    console.log(description);
    actual_Results = db_Helpers
      .clear_Links(
        mongoLab_URI,//:str
        collection_Name//:str
    );
    console.log("typeof actual_Results:", (typeof actual_Results));
    // actual_Results: Promise { <pending> }
    console.log("actual_Results:", actual_Results);
    // databaseName: 'sandbox_mongo-db_v3-0'

    return Promise.resolve(
      actual_Results
        .then((db) => {
          console.log("db:", db);
          db.close();

          return db;
        }
      )
    );
  };
}("test 6: must drop collection & return current DB object");
//("tests");

var test_7 = function(description){
  "use strict";
  // curred
  return function(
    collection_Name//:str
    ,db_Promise//:Promise obj
  )/* => Promise ? */ {
    "use strict";
    console.log(description);
    var actual_Results;
    // case 2: db passed
    db_Promise.then((db) => {
      actual_Results = db_Helpers.get_Collection(
        mongoLab_URI,//:str
        collection_Name//:str
        ,db
      );
      console.log("typeof actual_Results:", (typeof actual_Results));
      // actual_Results: Promise { collection }
      console.log("actual_Results:", actual_Results);
      // namespace: 'sandbox_mongo-db_v3-0.tests',
      // name: 'tests',
      // promiseLibrary: [Function: Promise],
      /*
      Promise
        // `resolves` without `then`
        .resolve(
          actual_Results
            //.then((col) => {console.log("col:", col);})
      );
      */
      db.close();
    }).catch((err) => {console.log("db_Promise then:", err.stack);}
    );
  };
}("test 7: must return collection object from DB, when db passed");
//("tests", db_Helpers.get_DB(mongoLab_URI));
//works but better use getter from above
//("tests", db_Helpers.clear_Links(mongoLab_URI, "tests"));

var test_8 = function(description){
  "use strict";
  // curred
  return function(
    //collection_Name//:str
    //,mongoLab_URI//:str
    collection_Promise//:Promise obj
    //,db_Promise//:Promise obj
  )/* => Promise ? */ {
    "use strict";
    console.log(description);
    var actual_Results;
    // case 1: no db passed, db_URI only
    /*
    actual_Results = get_Collection(
      mongoLab_URI,//:str
      collection_Name//:str
      //,db
    );
    actual_Results*/
    collection_Promise
      .then((collection) => {

        console.log("collection:", collection);
        //console.log("typeof actual_Results:", (typeof actual_Results));
        // namespace: 'sandbox_mongo-db_v3-0.tests',
        // name: 'tests',
        // promiseLibrary: [Function: Promise],
        //console.log("collection.db:%j", collection.db);
        // TypeError: Cannot read property 'close' of undefined
        //collection.db.close();
        //collection.s.db.close();
        var db = collection.s.db;
        db.close();
    }).catch((err) => {console.log("collection_Promise then:", err.stack);}
    );
  };
}("test 8: must return collection object from DB, when no db passed");
//(db_Helpers.get_Collection(mongoLab_URI, "tests"));
//("tests", mongoLab_URI);

var test_9 = function(description){
  "use strict";
  // curred
  return function(
    url//:str
    ,expected_Result//:list of bool
  )/* => list of bool */ {
    "use strict";
    console.log(description);

    var results = [];
    var result;
    var getter = require('https');
    //var express = require('express');
    //var app = express();

    //app.on('mount', callback(parent))
    //app.on('error', (err) => {console.log("express error:", err.stack);});

    return Promise.resolve(
    /*
    app
      // Routes HTTP GET requests (to the running app.listen(port, [hostname], [backlog], [callback]))
      // to the specified path
      // with the specified callback functions.
      .get(
        url,
        function (err, req, res, next) {
          !(err) || console.log("express error:", err.stack);
          result = res.get('Content-Type');
          console.log("res.get('Content-Type'):", result);
          //res.send('GET request to homepage');
          assert(result == expected_Result);
          assert.equal(result, expected_Result);
          //assert.deepEqual(results, expected_Results);
          next();

          return result;
        }
      */
      getter
        .get(
          url,
          (response) => {
            console.log(`Got response: ${response.statusCode}`);
            console.log('headers: ', response.headers);
            var contentType = (
              response.getHeader ? response.getHeader('content-type') : response.headers['content-type']);

            //readable
            //response.resume();
            // `explicitly` convert to `Strings`
            // rather than standard `Buffer` `objects`
            response.setEncoding('utf8');
            response
              .once(
                'data',
                (data) => {
                  // row data Buffer
                  console.log("data:", data);
                }
            );
            //response.end([data][, encoding][, callback])
            //response.body ? console.log("data:", data) : console.log("response.body:", response.body);
            //console.log("response.body:", response.body);

            assert(contentType == expected_Result);
            assert.equal(contentType, expected_Result);
            //assert.deepEqual(results, expected_Results);
            //next();

            return contentType;
          }
        )
        .on('error', (err) => {console.log("url getter error:", err.stack);}
      )
    );
  };
}("test 9: must receive correct / expected 'content-type' from response to remote server")
// res.type('.html');              // => 'text/html'
// res.type('html');               // => 'text/html'
// res.get('Content-Type'); => "text/plain"
//("https://api-url-shortener-microservice.herokuapp.com/", "text/html")
// res.type('json');               // => 'application/json'
// res.type('application/json');   // => 'application/json'
//("https://api-url-shortener-microservice.herokuapp.com/lInK", "application/json")
//("https://api-url-shortener-microservice.herokuapp.com/new/http://expressjs.com/en/4x/api.html#res.type"
//, "application/json")
;

/* jshint esversion: 6, laxcomma: true */
/**/
var test_10 = function(description){
  "use strict";
  // curred
  return function(
    MongoClient//: MongoClient obj <- explicit
    ,mongoLab_URI//: str
    //,connection//: MongoClient.connect obj <- optional
    //,db//: MongoClient.connect.then() obj <- optional
    //,collection//: db.collection obj <- optional
    ,collection_Name//: str
    ,original_Link//: str
    ,short_Link_Size//: int
    //,documents//: list of obj
    //,query//: query obj
  ) {//: => Promise | thenable ((dict | obj) | undefined | error)
    "use strict";
    console.log(description);
    var connection = MongoClient.connect(mongoLab_URI);
    //var db = Promise.resolve(connection.then((db) => {return db;}));
    var db;// = connection.then((_db) => {return _db;});
    //var db = Promise.resolve(connection.then((db) => {return Promise.resolve(db);}));
    var collection;// = Promise.resolve(db.then((_db) => {return Promise.resolve(_db.collection(collection_Name));}));
    var result = db_Helpers
      .find_Short_Link(
        MongoClient//: MongoClient obj <- explicit
        ,mongoLab_URI//: str
        ,connection//: MongoClient.connect obj <- optional
        ,db//: MongoClient.connect.then() obj <- optional
        ,collection//: db.collection obj <- optional
        ,collection_Name//: str
        ,original_Link//: str
        ,short_Link_Size//: int
        ,env.DEBUG_MODE.value
    );

    //if (db && collection) {
    //} else if (db) {
    //} else {
      //return result;
      //return Promise.resolve(result
      return result
        .then((f_R) => {
            console.log("f_R.document:", f_R.document, "is_New:", f_R.is_New);
            console.log("typeof(f_R.db)", typeof(f_R.db));
            if (f_R.db) {
              console.log("closing db ...");
              f_R.db.close();
            }
          }
        )
        .catch((err) => {console.log("result.then():", err.stack);}
        //)
      );
    //}
  }
}("test 10: must " +
"using MongoClient, mongoLab_URI without passed db & collection objects\n" +
"find matched documents in collection if any &\n" +
"return as Promise | thenable containing as result:\n" +
"-> new short_Link as (from) 1st non-matched document if any\n" +
"with all (both) field values not in db.collection\n" +
"or -> existing short_url\n" +
"or -> undefined\n" +
"also db object to allow to close opened current connection")
//(MongoClient, mongoLab_URI, "tests", "o_L_0", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_1", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_2", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_3", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_4", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_5", 1)
///(MongoClient, mongoLab_URI, "tests", docs_Case_3)
///(MongoClient, mongoLab_URI, "tests", docs_Case_2)
///(MongoClient, mongoLab_URI, "tests", docs_Case_1)
;

var test_10_2 = function(description){
  "use strict";
  // curred
  return function(
    MongoClient//: MongoClient obj <- explicit
    ,mongoLab_URI//: str
    //,connection//: MongoClient.connect obj <- optional
    //,db//: MongoClient.connect.then() obj <- optional
    //,collection//: db.collection obj <- optional
    ,collection_Name//: str
    ,original_Link//: str
    ,short_Link_Size//: int
    //,documents//: list of obj
    //,query//: query obj
  ) {//: => Promise | thenable ((dict | obj) | undefined | error)
    "use strict";
    console.log(description);
    var connection = MongoClient.connect(mongoLab_URI);

    return connection
      .then((db) => {
        var collection;// = Promise.resolve(db.then((_db) => {return Promise.resolve(_db.collection(collection_Name));}));
        var result = db_Helpers
          .find_Short_Link(
            MongoClient//: MongoClient obj <- explicit
            ,mongoLab_URI//: str
            ,connection//: MongoClient.connect obj <- optional
            ,db//: MongoClient.connect.then() obj <- optional
            ,collection//: db.collection obj <- optional
            ,collection_Name//: str
            ,original_Link//: str
            ,short_Link_Size//: int
            ,env.DEBUG_MODE.value
        );

        return result
          .then((f_R) => {
              console.log("f_R.document:", f_R.document, "is_New:", f_R.is_New);
              console.log("typeof(f_R.db)", typeof(f_R.db));
              if (f_R.db) {
                console.log("closing db ...");
                f_R.db.close();
              }
            }
          )
          .catch((err) => {console.log("result.then():", err.stack);}
        );
      }
      )
      .catch((err) => {console.log("connection.then():", err.stack);}
    );
  }
}("test 10.2: must " +
"using MongoClient, mongoLab_URI, db without passed collection object\n" +
"find matched documents in collection if any &\n" +
"return as Promise | thenable containing as result:\n" +
"-> new short_Link as (from) 1st non-matched document if any\n" +
"with all (both) field values not in db.collection\n" +
"or -> existing short_url\n" +
"or -> undefined\n" +
"also db object to allow to close opened current connection")
//(MongoClient, mongoLab_URI, "tests", "o_L_0", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_1", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_2", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_3", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_4", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_5", 1)
///(MongoClient, mongoLab_URI, "tests", docs_Case_3)
///(MongoClient, mongoLab_URI, "tests", docs_Case_2)
///(MongoClient, mongoLab_URI, "tests", docs_Case_1)
;

var test_10_3 = function(description){
  "use strict";
  // curred
  return function(
    MongoClient//: MongoClient obj <- explicit
    ,mongoLab_URI//: str
    //,connection//: MongoClient.connect obj <- optional
    //,db//: MongoClient.connect.then() obj <- optional
    //,collection//: db.collection obj <- optional
    ,collection_Name//: str
    ,original_Link//: str
    ,short_Link_Size//: int
    //,documents//: list of obj
    //,query//: query obj
  ) {//: => Promise | thenable ((dict | obj) | undefined | error)
    "use strict";
    console.log(description);
    var connection = MongoClient.connect(mongoLab_URI);

    return connection
      .then((db) => {
        var collection = db.collection(collection_Name);
        var result = db_Helpers
          .find_Short_Link(
            MongoClient//: MongoClient obj <- explicit
            ,mongoLab_URI//: str
            ,connection//: MongoClient.connect obj <- optional
            ,db//: MongoClient.connect.then() obj <- optional
            ,collection//: db.collection obj <- optional
            ,collection_Name//: str
            ,original_Link//: str
            ,short_Link_Size//: int
            ,env.DEBUG_MODE.value
        );

        return result
          .then((f_R) => {
              console.log("f_R.document:", f_R.document, "is_New:", f_R.is_New);
              console.log("typeof(f_R.db)", typeof(f_R.db));
              if (f_R.db) {
                console.log("closing db ...");
                f_R.db.close();
              }
            }
          )
          .catch((err) => {console.log("result.then():", err.stack);}
        );
      }
      )
      .catch((err) => {console.log("connection.then():", err.stack);}
    );
  }
}("test 10.3: must " +
"using MongoClient, mongoLab_URI, db & passed collection object\n" +
"find matched documents in collection if any &\n" +
"return as Promise | thenable containing as result:\n" +
"-> new short_Link as (from) 1st non-matched document if any\n" +
"with all (both) field values not in db.collection\n" +
"or -> existing short_url\n" +
"or -> undefined\n" +
"also db object to allow to close opened current connection")
//(MongoClient, mongoLab_URI, "tests", "o_L_0", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_1", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_2", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_3", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_4", 1)
//(MongoClient, mongoLab_URI, "tests", "o_L_5", 1)
///(MongoClient, mongoLab_URI, "tests", docs_Case_3)
///(MongoClient, mongoLab_URI, "tests", docs_Case_2)
///(MongoClient, mongoLab_URI, "tests", docs_Case_1)
;

var test_11 = function(description){
  "use strict";
  // curred
  return function(
    this_List//: list (of obj)
    ,other_List//: list (of obj)
  ) {//: => list | undefined
    "use strict";
    console.log(description);

    var result;
    var results = [];

    !(env.DEBUG_MODE.value) || console.log(
      "this_List:\n", this_List
      ,"\nvs.\nthat_List:\n", other_List
    );
    results = comparator.lists_Difference(
      this_List//: list (of obj)
      ,other_List//: list (of obj)
      ,env.DEBUG_MODE.value
    );
    !(env.DEBUG_MODE.value) || console.log(
      "lists_Difference:\n", results
    );

    return results;
  }
}("test 11: must " +
"return elements form this list that are not in that list\n " +
"criterion: no duplicated field values\n " +
"only unique one")
//(docs_Case_2, docs_Case_3)
//([], [])
//([], docs_Case_3)
//(docs_Case_2, [])
;

var test_12 = function(description){
  "use strict";
  // curred
  return function(
    MongoClient//: MongoClient obj <- explicit
    ,mongoLab_URI//: str
    ,collection_Name//: str
    ,document_Obj//: dict
  ) {//: => list | undefined
    "use strict";
    console.log(description);

    var result;
    var results = [];
    var is_Debug_Mode = env.DEBUG_MODE.value;

    !(is_Debug_Mode) || console.log(
      "inserting:", document_Obj
      ,"\ninto:", mongoLab_URI, collection_Name
    );

    //var collection_Promise = db_Helpers
    var db_Collection_Promise = db_Helpers
      .get_Collection(
        MongoClient//: MongoClient obj <- explicit
        ,mongoLab_URI//: str
        //,"tests"
        ,collection_Name//: str
        ,null//db//: obj [db] <- optional
        ,is_Debug_Mode//is_Debug_Mode//: bool <- optional
    );

    //return collection_Promise
    return db_Collection_Promise
      //.then((collection) => {
      .then((db_Collection) => {
          var db = db_Collection.db;
          var collection = db_Collection.collection;

          db_Helpers
            .insert_Link_To_DB(
              null//db//: mongoDB obj
              ,collection//: mongoDB obj
              ,document_Obj//: dict
              ,null//response//: HTTP(S) obj
              ,{}//json_Response_Obj//: dict
              ,"testing db insert"//context_Message//: str <- optional
              ,is_Debug_Mode//: bool <- optional
            )
            .then((insert_Result) => {
                !(is_Debug_Mode) || console.log(
                  "insert_Link_To_DB.insert_Result:", insert_Result);
                  if (db) {
                    db.close();
                    !(is_Debug_Mode) || console.log("Close db after link insert");
                  }
                  if (collection.s.db) {
                    collection.s.db.close();
                    !(is_Debug_Mode) || console.log("Close collection.s.db after link insert");
                  }

                return Promise.resolve(insert_Result);
              }
            )
            .catch((err) => {
              !(is_Debug_Mode) || console.log(
                "insert_Link_To_DB.then():", err.stack);
              if (db) {
                db.close();
                !(is_Debug_Mode) || console.log("Close db after link insert");
              }
              if (collection.s.db) {
                collection.s.db.close();
                !(is_Debug_Mode) || console.log("Close collection.s.db after link insert");
              }

              return Promise.reject(err);
            }
          );
        }
      )
      .catch((err) => {
        !(is_Debug_Mode) || console.log(
          "collection_Promise.then():", err.stack);

        return Promise.reject(err);
      }
    );
  }
}("test 12: must " +
"insert one document into db.collection\n " +
"then return insertion results")
//(MongoClient, mongoLab_URI, "tests", {"original_url": "o_L_4", "short_url": "g"})
//(MongoClient, mongoLab_URI, "tests", {"original_url": "o_L_4", "short_url": "f"})
//(MongoClient, mongoLab_URI, "tests", {"original_url": "o_L_5", "short_url": "f"})
//(MongoClient, mongoLab_URI, "tests", {"original_url": "o_L_5", "short_url": "h"})
//(MongoClient, mongoLab_URI, "tests", {"original_url": "o_L_6", "short_url": "h"})
//(MongoClient, mongoLab_URI, "tests", {"original_url": "o_L_7", "short_url": "j"})
;
/*** tests end ***/

//***#####################################################################***//
/*** unit test (main) ***/
var run_Tests = [
  {"test": 1, "run": 0}
  ,{"test": 2, "run": 0}
  ,{"test": 3, "run": 0}
  ,{"test": 4, "run": 0}
  ,{"test": 5, "run": 1}
];

if (
  run_Tests[0].run == 1
  //true
  //false
) {
  //assert.deepEqual(actual_Results, expected_Results);
}
if (
  //true
  //false
  0 == 1
) {
  // case 1: empty collection, no duplicate hits
  actual_Results = test_2();
  // case 2: non-empty collection, no duplicate hits for field of same length
  //actual_Results = test_2();
  // case 3: non-empty collection, high probability of duplicate hits for field of same length
  //actual_Results = test_2();
}
if (
  //true
  //false
  0 == 1
) {
  actual_Results = test_3();
  expected_Results = (
    false
    //true
  );
  assert(actual_Results == expected_Results);
}
if (
  //true
  //false
  0 == 1
) {
  actual_Results = test_4(1, 150000);
  expected_Results = false;
  //assert(actual_Results == expected_Results);
  // or (same as)
  assert.equal(actual_Results, expected_Results);
}

if (
  //true
  //false
  0 == 1
) {
  // case 1: no db passed
  // actual_Results: Promise { undefined }
  // actual_Results: Promise { <pending> }
  /*
  Internally, a promise can be in one of three states:
    - Pending,
    when the final value is not available yet.
    This is the only state
    that may transition to
    one of the other two states.
    - Fulfilled,
    when and if the final value becomes available.
    A fulfillment value becomes
    permanently associated with the promise.
    This may be any value, including undefined.
    - Rejected,
    if an error prevented the final value from being determined.
    A rejection reason becomes
    permanently associated with the promise.
    This may be
    any value, including undefined,
    though it is generally an Error object,
    like in exception handling.

  Promise then(
    Function onFulfill,
    Function onReject
  );
  Parameters:
  - onFulfill Optional
  If the promise is `fulfilled`,
  this function is invoked
  with the `fulfillment` `value` of the `promise`
  as its only argument, and
  the `outcome` of the function determines
  the `state` of the new `promise`
  `returned` by the `then` method.
  In case
  this parameter is
  not a function (usually 'null'),
  the new `promise` `returned` by the `then` method is
  `fulfilled` with
  the same `value` as the original `promise`.

  Return value
    A new `promise`
    that is initially `pending`,
    then assumes a `state`
    that depends on
    the outcome of the invoked `callback` function:
      - If the `callback` returns a value
      that is not a `promise`, including `undefined`,
      the new `promise` is `fulfilled`
      with this fulfillment `value`,
      even if the original `promise` was `rejected`.
      - If the `callback` `throws` an `exception`,
      the new `promise` is `rejected`
      with the `exception` as the `rejection` reason,
      even if the original `promise` was `fulfilled`.
      - If the `callback` `returns` a `promise`,
      the new `promise` will eventually assume
      the same `state` as the `returned` `promise`.
  */
  console.log("actual_Results:", actual_Results);
  // namespace: 'sandbox_mongo-db_v3-0.tests',
  // name: 'tests',
  // promiseLibrary: [Function: Promise],
  ///Promise.resolve(actual_Results);
  ///Promise
    // ? not `resolves` without `then` ?
    ///.resolve(
      //actual_Results
        /*
        then()
        Calls one of the provided functions
        as soon as this promise is either
        fulfilled or rejected.
        A new promise is returned,
        whose state evolves depending on this promise and
        the provided callback functions.

        The appropriate callback is
        always invoked after this method returns,
        even if
        this promise is already fulfilled or rejected.
        You can also
        call the then method multiple times
        on the same promise, and
        the callbacks will be invoked in the same order
        as they were registered.
        */
        /*
        .then((col) => {
            console.log("col:", col);

            ///Promise.resolve(actual_Results);
            ///return Promise.resolve(col);
            return Promise.resolve(actual_Results);
          }
        )
        */
        /*
        .then((col) => {
          // typeof col: undefined
          // if using above return Promise.resolve(actual_Results) than
          // typeof col: object
          console.log("typeof col:", (typeof col));
          console.log("actual_Results:", actual_Results);
          //return Promise.resolve(actual_Results);
          return col;
        }
      );
      */
  ///);
}