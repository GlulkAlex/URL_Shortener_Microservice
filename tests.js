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
var env;// = require('./.env.json');
try {env = require('./.env.json');
}catch(err){
  console.warn("config file missing, so as actual connection info too");
  env = {
    "TEST_MONGODB": {
      "value": false
    }
  };
}
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
//.choose_Options()
//.get_Short_Link_Length()
const link_Gen = require('./short_link_generator.js');//.short_Link_Generator;
//generate_Unique_Short_Link
// started hole app, not just import designated functions
//const db_Helpers = require('./app.js');
//exports.make_Unique_Link
const db_Helpers = require('./db_Helpers.js');
/*** application modules end ***/

/*** helpers ***/
// TODO create unique fields indexes
// TODO query for (check if) field value in the list
// TODO extract info about successfully inserted documents from 'insertMany' result
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

// useless, nothing different form MongoClient.connect
function get_DB(
  mongoLab_URI//: str
)/* => Promise(db) */{
  "use strict";

  var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {

  // Promise <pending> -> thanble
  //return Promise.resolve(connection.then((db) => {return db;}));
  return connection.then((db) => {return db;});
}

function get_Collection(
  mongoLab_URI//:str
  ,collection_Name//:str
  ,db//: obj [db]
)/* => Promise(collection) */{
  "use strict";

  if (db) {
    return Promise
      .resolve(
        //() => {
          //var collection =
          db.collection(collection_Name)//;

          //return collection;
        //}
    );
  } else {
    //var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
    collection_Name = collection_Name ? collection_Name : 'tests';
    //db = Promise.resolve(get_DB(mongoLab_URI));
    //db = Promise.resolve(get_DB(mongoLab_URI).then((dB) => {return dB;}));

    //db.collections(function(err, collections) {
    // ? Promise <pending> ?
    // without .resolve
    // typeof return: undefined
    // something like .flatMap needed
    // CORRECT (the function returns a promise, and the caller will handle the rejection)
    // Resolving with `thenables` to flatten nested then() calls
    return Promise.resolve(
      //connection
        //.then((db) => {return db;})
      get_DB(mongoLab_URI)
        .then((db) => {
        // defined `this` does not make any changes on `pending`
        //.then(function(db) {
            // Create a collection we want to drop later
            // Returns:
            // the new Collection instance if not in strict mode
            //db.collection('test_correctly_access_collections', {strict:true}, function(err, col3) {
            //var collection = db.collection(collection_Name);

            // not helping, still having
            // return: Promise { <pending> }
            //return Promise.resolve(collection);
            ///return Promise.resolve((c) => {return c;});
            //return collection;
            /*
            // works but give the same results / behaviour as before / above
            return db
              .collection(
                collection_Name
                //, {strict:true}
                , function(err, col) {
                  if (err) {
                    return Promise.reject(err);
                  } else {
                    return Promise.resolve(col);
                  }
                }
            );
            */
            /*
            // works but give the same results / behaviour as before / above
            return new Promise(
              function(resolve, reject) {
                db
                .collection(
                  collection_Name
                  //, {strict:true}
                  , function(err, col) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(col);
                    }
                });
            });
            */
            return db.collection(collection_Name);
          }
      )
      // TypeError: db.collection is not a function
      //db.collection(collection_Name)
    );
  }
}

function clear_Links(
  mongoLab_URI,//: str
  collection_Name//: str
)/* => Promise(db) */{
  "use strict";

  var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
  collection_Name = collection_Name ? collection_Name : 'tests';

  // Promise <pending> -> thanble
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

        return db;
      }
      ).catch((err) => {console.log("connection err:", err.stack);}
    )
  );
};

function create_Unique_Index(
  //mongoLab_URI//:str
  //,collection_Name//:str
  collection//: obj [collection]
  ,field_Name//:str
)/* => Promise */{
  "use strict";

  //var collection = get_Collection(
  //  mongoLab_URI,//:str
  //  collection_Name ? collection_Name : 'tests'//:str
  //);
  if (collection) {
    return Promise.resolve(
      //clear.then err: ReferenceError: collection is not defined
      // Create an index on the a field
      collection
        // TypeError: collection.createIndex is not a function
        .createIndex(
          {field_Name:1}
          , {unique:true, background:true, w:1}
        )
        .then((indexName) => {
            console.log("indexName:", indexName, "for", field_Name, "field created");
          }
        ).catch((err) => {
            console.log("connection err:", err.code);
            console.log(err.stack);
          }
      )
    );
  } else {
    console.log("collection undefined ?:", collection);
  }
};

function add_Docs(
  //mongoLab_URI//:str
  documents//:list of obj
  //,collection_Name//:str
  ,collection//: obj [collection]
)/* => Promise(result) */{
  "use strict";

  //var collection = get_Collection(
  //  mongoLab_URI//:str
  //  ,(collection_Name ? collection_Name : 'tests')//:str
  //);

  // ? Promise <pending> ?
  return Promise.resolve(
    collection
      .insertMany(documents)//, function(err, r) {
      .then((result) => {
            console.log("added:", result.insertedCount, "documents to ", collection_Name);
            // Let's close the db
            db.close();


            //return Promise.resolve(result);
            return result;
          }
        ).catch((err) => {
            // MongoError: ns (name space -> <db.collection>) not found
            console.log("insertMany err:", err.code);
            console.log(err.stack);
          }
      )
  );
};
/*** helpers end ***/

/*** tests ***/
var test_1 = function(
  description//:str
  ,hosts//:list
) {
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

  return results;
};
//}("test 1: must check for a valid host name");

// DONE 1.drop collection
// DONE 2.dummy data generator
// DONE 3.insert generated data
var test_2 = function(
  description//:str
) {
  "use strict";
  console.log(description);
  var result;
  var results = [];
  var docs_Number = 7;
  var documents = [];

  console.log("mongoLab_URI is:", mongoLab_URI);
  documents = make_Links_Documents(docs_Number);
  console.log("results: %j", documents);
  //"tests"
  var clear = clear_Links(mongoLab_URI, "tests");
  //console.log("typeof clear:", (typeof clear));
  //console.log("clear instanceof Promise:", (clear instanceof Promise));

  clear
    // clear.then err: undefined
    .then(() => {
      add_Docs(
        documents,//:list of obj
        "tests"//:str
      );
    }
    ).catch((err) => {
      console.log("clear.then err:", err.code);
      console.log(err.stack);
    }
  );


  //return results;
};
//}("test 2: must drop existing collection, create new one & insert list of documents to it in DB");

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
};
//}("test 3: choose_Options must be non-empty");

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
};//("test 4: all links must be non-empty", 1, 150000);/*() <- on / off */

var test_5 = function(
  description
  ,collection_Name//:str
  ,documents//:list of obj
  ,indexes_List//:list of str
)/* => Promise ? */ {
  "use strict";
  console.log(description);
  var result;
  var results = [];

  console.log("mongoLab_URI is:", mongoLab_URI);
  //results = make_Links_Documents(7);
  //console.log("results: %j", results);
  //"tests"
  var clear = clear_Links(mongoLab_URI, collection_Name);
  console.log("typeof clear:", (typeof clear));
  console.log("clear instanceof Promise:", (clear instanceof Promise));

  clear
    .then((db) => {
        var collection = get_Collection(
          mongoLab_URI,//:str
          collection_Name//:str
          ,db
        );
        console.log("typeof collection:", (typeof collection));
        console.log("collection instanceof Promise:", (collection instanceof Promise));
        console.log("collection Promise status:", collection);

        create_Unique_Index(
          //"tests"//:str
          //collection_Name
          collection
          ,"short_url"//:str
        )
        .then(() => {
            add_Docs(
              documents,//:list of obj
              //collection_Name//:str
              collection
            );
            // already handled (within)in above function
            //.catch((err) => {console.log("add_Docs.then err:", err.stack);});
          }
        )
        .catch((err) => {console.log("create_Unique_Index.then err:", err.stack);});
      }
    ).catch((err) => {console.log("clear.then err:", err.stack);}
  );


  //return results;
};//("test 5: ", null, null, null);

var test_6 = function(description){
  "use strict";
  console.log(description);
  // curred
  return function(
    collection_Name//:str
    //,documents//:list of obj
  )/* => Promise ? */ {
    "use strict";
    actual_Results = clear_Links(
      mongoLab_URI,//:str
      collection_Name//:str
    );
    console.log("typeof actual_Results:", (typeof actual_Results));
    // actual_Results: Promise { <pending> }
    console.log("actual_Results:", actual_Results);
    // databaseName: 'sandbox_mongo-db_v3-0'
    Promise.resolve(actual_Results.then((db) => {console.log("db:", db); db.close();}));
  };
}("test 6: must drop collection & return current DB object")//;
("tests");

/*** tests end ***/

//***#####################################################################***//
/*** unit test (main) ***/
var actual_Results;
var expected_Results;
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
  1 == 0
) {
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
  //actual_Results =
  test_5(
    "tests"//:str
    ,[
      {"original_url" : "o_L_1", "short_url" : "a"}
      ,{"original_url" : "o_L_2", "short_url" : "b"}
      ,{"original_url" : "o_L_3", "short_url" : "c"}
      ,{"original_url" : "o_L_4", "short_url" : "vV"}
    ]
   );
  //expected_Results = false;
  //assert(actual_Results == expected_Results);
  // or (same as)
  //assert.equal(actual_Results, expected_Results);
}
if (
  //true
  //false
  1 == 0
) {
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
  //actual_Results =
  test_5(
    "tests"//:str
    ,[
      {"original_url" : "o_L_0", "short_url" : "a"}
      ,{"original_url" : "o_L_0", "short_url" : "b"}
      ,{"original_url" : "o_L_0", "short_url" : "c"}
      ,{"original_url" : "o_L_0", "short_url" : "vV"}
    ]
   );
  //expected_Results = false;
  //assert(actual_Results == expected_Results);
  // or (same as)
  //assert.equal(actual_Results, expected_Results);
}
if (
  //true
  //false
  1 == 0
) {
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
  //actual_Results =
  test_5(
    "tests"//:str
    ,[
      {"original_url" : "o_L_0", "short_url" : "a"}
      ,{"original_url" : "o_L_0", "short_url" : "a"}
      ,{"original_url" : "o_L_0", "short_url" : "a"}
      ,{"original_url" : "o_L_0", "short_url" : "vV"}
    ]
   );
  //expected_Results = false;
  //assert(actual_Results == expected_Results);
  // or (same as)
  //assert.equal(actual_Results, expected_Results);
}
if (
  //true
  //false
  1 == 0
) {
  //actual_Results = get_DB(
  actual_Results = //Promise
  //  .resolve(
      get_DB(
        mongoLab_URI//:str
      )
      .then((db) => {
        console.log("typeof actual_Results:", (typeof actual_Results));
        // actual_Results: Promise { <pending> }
        console.log("actual_Results:", actual_Results);
        console.log("db:", db);

        return db;
      }).catch((err) => {console.log("get_DB.then err:", err.stack);}//)
  );
  // databaseName: 'sandbox_mongo-db_v3-0'
  /*
  actual_Results = Promise
    .resolve(
      actual_Results
        .then((db) => {
            //console.log("actual_Results:", actual_Results);
            console.log("db:", db);
          }
        )
  );
  */
  //console.log("actual_Results:", actual_Results);
}
if (
  //true
  //false
  0 == 1
) {
  // case 1: no db passed
  // actual_Results: Promise { undefined }
  actual_Results = //Promise
    //.resolve(
    //.all([
      get_Collection(
        mongoLab_URI,//:str
        "tests"//:str
      )
      /**/
      .then((col) => {
      //.then(function(col) {
            console.log("col:", col);
            console.log("actual_Results:", actual_Results);

            return col;
            //return Promise.resolve(col);
            //return {"collection": col};
          }
      )
      .catch((err) => {console.log("get_Collection.then err:", err.stack);}
    //)
    /**/
    //]
  );
  console.log("typeof actual_Results:", (typeof actual_Results));
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
if (
  //true
  //false
  0 == 1
) {
  // case 2: db passed
  clear_Links(
    mongoLab_URI,//:str
    "tests"//:str
  ).then((db) => {
    actual_Results = get_Collection(
      mongoLab_URI,//:str
      "tests"//:str
      ,db
    );
    console.log("typeof actual_Results:", (typeof actual_Results));
    // actual_Results: Promise { collection }
    console.log("actual_Results:", actual_Results);
    // namespace: 'sandbox_mongo-db_v3-0.tests',
    // name: 'tests',
    // promiseLibrary: [Function: Promise],
    Promise
      // `resolves` without `then`
      .resolve(
        actual_Results
          //.then((col) => {console.log("col:", col);})
    );
  });
}
