"use strict";
// helper
// useless, nothing different form MongoClient.connect
function get_DB(
  mongoLab_URI//: str
  ,MongoClient//: MongoClient obj <- explicit
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
  ,db//: obj [db] <- optional
  ,MongoClient//: MongoClient obj <- explicit
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
    if (MongoClient) {
      //var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
      collection_Name = collection_Name ? collection_Name : 'tests';
      //db = Promise.resolve(get_DB(mongoLab_URI));
      //db = Promise.resolve(get_DB(mongoLab_URI).then((dB) => {return dB;}));

      //db.collections(function(err, collections) {
      // ? Promise <pending> ?
      // without .resolve
      // typeof return: undefined
      // something like .flatMap needed ? or just db.close() in the right place ?
      // CORRECT (the function returns a promise, and the caller will handle the rejection)
      // Resolving with `thenables` to flatten nested then() calls
      return Promise.resolve(
        //connection
          //.then((db) => {return db;})
        //get_DB(mongoLab_URI)
        // same as
        // TypeError: Cannot read property 'connect' of undefined
        MongoClient.connect(mongoLab_URI)
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
        // work, but changes nothing
        //.then((collection) => {return collection;})
        // TypeError: db.collection is not a function
        //db.collection(collection_Name)
      );
    } else {
      return Promise.resolve(console.log("missing MongoClient argument"));
    }
  }
}

function clear_Links(
  mongoLab_URI//: str
  ,collection_Name//: str
  ,MongoClient//: MongoClient obj <- explicit
)/* => Promise(db) */{
  "use strict";

  if (MongoClient) {
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
                // ? close it outside in .then() ?
                // this is important as it affects next actions
                //db.close();

                //return undefined;
                return db;
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
                    // connection err: undefined
                    //db.close();
                    return db;
                  }
                  ).catch((err) => {
                      // MongoError: ns not found
                      if (db) {
                        //db.close();
                        return db;
                      }

                      return console.log("drop err:", err.stack);
                    }
                );

                //return col;
              }
            }
          );

          //return db;
        }
        ).catch((err) => {console.log("connection err:", err.stack);}
      )
    );
  } else {
    return Promise.resolve(console.log("missing MongoClient argument"));
  }
};

// helper
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
  if (
    collection && field_Name
    && typeof(field_Name) == 'string' && field_Name.length > 0
  ) {
    console.log("creating index for", field_Name, "field");
    var db = collection.s.db;
    var field_Spec = {};
    field_Spec[field_Name] = 1;

    return Promise
      .resolve(
        //clear.then err: ReferenceError: collection is not defined
        // Create an index on the a field
        collection
          // TypeError: collection.createIndex is not a function
          .createIndex(
            field_Spec
            //{field_Name: 1}// <- obj literal failed, `field_Name` was not substituted by its value
            //"{" + field_Name + ": 1}"//: str <- wrong syntax
            //field_Name//: str
            , {"unique": true, "background": true, "w": 1}
          )
          .then((indexName) => {
              console.log("indexName:", indexName, "for", field_Name, "field created");
              if (
                db
                //collection.s.db
              ) {
                //console.log("closing db");
                //db.close();
              }

              return collection;// ? for further .then() ?
              //return indexName;
            }
          ).catch((err) => {
              console.log("connection err:", err.code);
              console.log(err.stack)
              if (
                db
                //collection.s.db
              ) {
                //console.log("closing db");
                //db.close();
              }
              return err;
            }
        )
    );
  } else {
    console.log("collection or field_Name undefined ?:", collection, field_Name);
  }
};

// helper
function add_Docs(
  //mongoLab_URI//:str
  documents//:list of obj
  //,collection_Name//:str
  ,collection//: obj [collection]
)/* => Promise(result) */{
  "use strict";

  console.log("typeof collection:", (typeof collection));
  // collection instanceof Promise: false
  console.log("collection instanceof Promise:", (collection instanceof Promise));
  var collection_Name = collection.s.name;
  var db = collection.s.db;
  //var collection = get_Collection(
  //  mongoLab_URI//:str
  //  ,(collection_Name ? collection_Name : 'tests')//:str
  //);

  // ? Promise <pending> ?
  return Promise.resolve(
    collection
      // bulkWrite(operations, options, callback) => {Promise}
      // ordered	boolean	true
      // bulk_results.nInserted
      // bulk_results.insertedCount
      // insertMany err: undefined
      // ReferenceError: collection_Name is not defined
      // ? no { ordered: false } ?
      //.insertMany(
      .bulkWrite(
        documents
        ,{ ordered: false }
      )//, function(err, r) {
      .then((result) => {
            console.log("added:", result.insertedCount, "documents to ", collection_Name);
            // Let's close the db
            db.close();


            //return Promise.resolve(result);
            return result;
          }
        ).catch((err) => {
            // MongoError: ns (name space -> <db.collection>) not found
            // MongoError: E11000 duplicate key error index:
            // sandbox_mongo-db_v3-0.tests.$field_Name_1 dup key: { : null }
            console.log("insertMany err:", err.code);
            // MongoError: write operation failed

            // this cancel pending
            if (db) {db.close();}

            return console.log(err.stack);
          }
      )
  );
};

// helper
function bulk_Docs_Insert(
  MongoClient//: MongoClient obj <- explicit
  ,mongoLab_URI//: str
  ,collection_Name//: str
  //,collection//: obj [collection]
  ,documents//:list of obj
)/* => Promise(result) */{
  "use strict";

  collection_Name = collection_Name ? collection_Name : 'tests';
  if (
    MongoClient && mongoLab_URI && collection_Name && documents
    //(MongoClient instanceof MongoClient)
    && typeof(mongoLab_URI) == 'string' && mongoLab_URI.length > 0
    && Array.isArray(documents) // || ([] instanceof Array)
    && documents.length > 0
  ) {
    var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {

    // Promise <pending> -> thanble <- no by able close db eventually
    return Promise.resolve(
      connection
        .then((db) => {
          // the new Collection instance if not in strict mode
          var collection = db.collection(collection_Name);

          return Promise.resolve(
            collection
              // bulkWrite(operations, options, callback) => {Promise}
              // ordered	boolean	true
              // bulk_results.nInserted
              // bulk_results.insertedCount
              .bulkWrite(
                documents
                ,{ ordered: false }
                //,{ ordered: true }
                //,{forceServerObjectId: true}
              )//, function(err, r) {
              .then((result) => {
                    console.log("added:", result.insertedCount, "documents to ", collection_Name);
                    // Let's close the db
                    console.log("closing db");
                    db.close();
                    //return db ? db : result;
                  }
              ).catch((err) => {
                  console.log("bulkWrite.then() err:", err.code);
                  console.log(err.stack)
                  if (db) {
                    console.log("db defined:");
                    console.log("closing db");
                    db.close();
                    //return db;
                  } else {
                    console.log("db undefined:");
                    //return err;
                  }
                }
            )
          );
        }
      ).catch((err) => {
          console.log("connection.then() err:", err.code);
          console.log(err.stack);
          //return err;
        }
      )
    );
  } else {
    console.log("some mandatory parameters are undefined or have the wrong type");
  }
};

// helper
function generate_Unique_Short_Link(
  collection_Size, //int <- may be evaluated / inferred from 'docs'
  docs,//list of obj
  callback// <- optional
) /* => thenable Promise => (str | error)*/{
  "use strict";

  var post_Condition = true;// executed at least once
  var is_Unique = true;
  var short_Link = "";
  var attempts_Counter = 0;
  var item_Index;
  var doc_Index;
  var doc;
  console.log('receive all docs in links.');
  // TODO 1. 3 attempts will be enough, then if fails => link size + 1
  // highly unlikely that all 3 random value will be the same, even for link size 1
  // link size + 1 as -> "fail safe"
  // TODO 2. link size as parameter / argument (not collection_Size)
  // DONE 3. so refactor get_Short_Link
  // TODO 4. replace check if (any) current link has match in DB
  // TODO with bulk insert of all generated values
  // assuming that at least one will succeed or all fails
  // TODO 4.1 so refactor return value to link list
  while (
    post_Condition
  ) {
    // must be generated at least once
    short_Link = short_Link_Gen
      .get_Short_Link(
        // must be found first <- crucial / almost mandatory
        collection_Size
    );
    is_Unique = true;
    if (docs.length > 0) {
    }
    // order does not matter
    for (doc_Index in docs) {
      doc = docs[doc_Index];
      if (doc.short_url == short_Link) {
        // fail, duplicated value => generate new one
        is_Unique = false;

        break;
      }
    }
    attempts_Counter += 1;
  }
  post_Condition = !(is_Unique) && (collection_Size > attempts_Counter);
  // insert must be next
  console.log('Unique short_Link:', short_Link);
  // Promise.resolve(thenable);
  if (callback) {
    //typeof ()=>{} == 'function'
    return callback(short_Link);
  } else {
    return Promise
      .resolve(
        short_Link
        //{
        //  then: (onFulfill, onReject) => {
        //    onFulfill(short_Link);
        //  }
        //}
    );
  }
}

// helper
function insert_Link_To_DB(
  db//: mongoDB obj
  ,collection//: mongoDB obj
  ,document_Obj//: dict
  //request,// HTTP(S) obj <- ? optional ?
  ,response//: HTTP(S) obj
  ,json_Response_Obj//: dict
  //host, //protocol + // + host_name
  //source_Link,// str <- optional
  ,context_Message//: str <- optional
  ,is_Debug_Mode//: bool <- optional
){//: => thenable Promise => ((null | void | Unit) | error)
  "use strict";
  //const
  var response_Helpers = require('./response_Helpers.js');
  var collection_Size = 0;
  //var short_Link; // = "";// = document_Obj.short_Link
  //var source_Link;
  //var json_Response_Obj = {};
  //var

  //*** positional arguments ***//
  //*** defaults ***//
  //document_Obj = document_Obj ? document_Obj : {};
  //json_Response_Obj = json_Response_Obj ? json_Response_Obj : {};
  if (context_Message) {
  } else {
    context_Message = "request.on 'end' query.allow insertOne";
  }
  //*** defaults end ***//

  /*
  short_Link = get_Unique_Short_Link(
    db,// mongoDB obj
    collection, // mongoDB obj
    source_Link// str
  );

  json_Response_Obj = {
    "original_url": (
      source_Link
    ),
    "short_url": (request.socket.encrypted ? 'https://' : 'http://') +
    request.headers.host + "/" +
    // may create duplicates
    // additional check needed
    short_Link,
    "message": "new link stored"
  }

  document_Obj = {
    "original_url": json_Response_Obj.original_url,
    "short_url": short_Link
  };
  */
  return Promise
    .resolve(() => {
  // guard
  // currently fires before link was generated
  if (document_Obj.short_url) {
    !(is_Debug_Mode) || console.log('short_url:', short_url, "provided");
    collection
      // insertOne(doc, options, callback) => {Promise}
      .insertOne(
        document_Obj
        //JSON.stringify(document_Obj)
      )
      .then(
        (result) => {//.result.n
          //console.log(JSON.stringify(document_Obj));
          !(is_Debug_Mode) || console.log('inserted document_Obj: %j', document_Obj);
          !(is_Debug_Mode) || console.log(`result.result.n: ${result.result.n}`);
          //console.log('result.result: %j', result.result);

          response_Helpers.
          send_JSON_Response(
            // obj -> writable stream
            response,
            json_Response_Obj,
            // context
            context_Message
          );

          /* finaly */
          db.close();
          !(is_Debug_Mode) || console.log(`Close db after link search & insert `);
        }
      )
      .catch(
        (err) => {
          // "E11000 duplicate key error index:
          // links.$original_url_text_short_url_text dup key: { : \"com\", : 0.625 }
          !(is_Debug_Mode) || console.log('(collection / cursor).insertOne error:', err.stack);
          json_Response_Obj = {
            "error": err.message,
            "message": "on links.insertOne{'short_url':" + document_Obj.short_url + //short_Link +
            "'original_url':" + document_Obj.original_url +
            " catch error when query.allow"
          };

          response_Helpers.
          send_JSON_Response(
            // obj -> writable stream
            response,
            json_Response_Obj,
            // context
            'request.on "end" query.allow .insertOne catch error'
          );
        }
    );
  } else {
    !(is_Debug_Mode) || console.log('undefined / empty document_Obj.short_url');
    //new Error(message)

  }
  });

  //return //null;//side effect //void //Unit
}

/* jshint esversion: 6, laxcomma: true */
function find_Short_Link(
  MongoClient//: MongoClient obj <- explicit
  ,mongoLab_URI//: str
  ,collection_Name//: str
  ,original_Link//: str
  ,short_Link_Size//: int
  //,documents//: list of obj
  //,query//: query obj
  ,is_Debug_Mode//: bool <- optional
) {//: => Promise | thenable ((dict | obj) | undefined | error)
  "use strict";

  var result;
  var documents;
  var query;
  var results = [];
  var short_Links = [];

  //!(env.DEBUG_MODE.value) || console.log("mongoLab_URI is:", mongoLab_URI);
  !(is_Debug_Mode) || console.log("short_Link_Size:", short_Link_Size);
  var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {

  short_Links.push(link_Gen.get_Short_Link(short_Link_Size));//, null, env.DEBUG_MODE.value));
  short_Links.push(link_Gen.get_Short_Link(short_Link_Size));
  short_Links.push(link_Gen.get_Short_Link(short_Link_Size));
  short_Links.push(link_Gen.get_Short_Link(short_Link_Size + 1));

  // one "original_url"
  // many "short_url"
  query = {
    $or: [
      {
        "original_url": original_Link
      }
      ,{
        "short_url": {
          $in: [
            short_Links[0]
            ,short_Links[1]
            ,short_Links[2]
            ,short_Links[3]
          ]
        }
      }
    ]
  };
  !(is_Debug_Mode) || console.log("query: %j", query);
  //return Promise.resolve(
  return connection
      .then((db) => {
          // the new Collection instance if not in strict mode
          var collection = db.collection(collection_Name);
          var cursor = collection
            .find(
              query
            )
            .project({"_id": false, "original_url": true, "short_url": 1})
            .toArray()
            .then((docs) => {
                !(is_Debug_Mode) || console.log("documents found:", docs.length);
                !(is_Debug_Mode) || console.log(docs);
                if (is_Debug_Mode) {
                  // Logging property names and values using Array.forEach
                  Object
                    //.getOwnPropertyNames(obj)
                    .keys(docs)
                    .forEach((val, idx, array) => {
                    //!(is_Debug_Mode) ||
                    console.log(
                      val,'->',docs[val]);
                  });
                }
                //*** find original_Link in docs ***//
                //var filtered = arr.filter(func);
                results = docs.filter((doc) => {return doc.original_url == original_Link;});
                if (results.length > 0) {
                  result = {"document": results[0], "is_New": false};
                } else {
                  //*** find Arrays / lists difference ***//
                  documents = [];
                  documents.push({"original_url": original_Link, "short_url": short_Links[0]});
                  documents.push({"original_url": original_Link, "short_url": short_Links[1]});
                  documents.push({"original_url": original_Link, "short_url": short_Links[2]});
                  documents.push({"original_url": original_Link, "short_url": short_Links[3]});

                  results = comparator.lists_Difference(
                    documents//: list (of obj)
                    ,docs//: list (of obj)
                    ,env.DEBUG_MODE.value
                  );
                  result = results.hasOwnProperty(0) ? results[0] : result;
                  result = {"document": result, "is_New": true};
                }
                !(is_Debug_Mode) || console.log("result", result);

                db.close();

                return Promise.resolve(
                  result
                );
              }
            )
            .catch((err) => {
              console.log("cursor.then():", err.stack);
              return Promise.reject(err);
            }
          );
        }
    )
    .catch((err) => {
      console.log("connection.then():", err.stack);
      return Promise.reject(err);
    }
  );
}

// just working code examples
if (false) {
mongo
.connect(
  //url,
  mongoLab_URI,
  function(
      err,
      db
  ) {
    // db gives access to the database
    if (err) {
      console.log('mongo.connect error:', err);
      //throw err;
    } else {
      const collection = db.collection(collection_Name);

      /*
      WriteResult({ "nInserted" : 1 })
      If the `insert` operation is successful,
      verify the insertion by
      querying the collection.
      */
      if (false) {
        //var write_Result =
        collection
          .insert(
          document_Obj,
          //JSON.stringify(document_Obj),
          function(
          err,
           //data
           result//.result.n
          ) {
            if (err) {
              console.log('(collection / cursor).insert error:', err);
              //throw err;
            } else {
              //console.log(data);
              //console.log(JSON.stringify(document_Obj));
              console.log('document_Obj: %j', document_Obj);
              if (is_Debug) {
                console.log(`result.result.n: ${result.result.n}`);
                console.log('result.result: %j', result.result);
              }
              /* finaly */
              db.close();
              //console.log(`Close db after ${original_url} search`);
            }
          }
        );
      }

      /*
      new Promise(executor);
      new Promise(function(resolve, reject) { ... });
      */
      // count(query, options, callback) => Promise
      collection
        .count({})
        .then(
          function(count) {
            ////assert.equal(err, null);
            //assert.equal(1, count);
            console.log(`collection_Name consist of / contains: ${count} documents`);

            //db.close();
          }
        )
        .catch(function(e) {
          console.log(e);
        }
      );

      collection
        .find(
          {
            "firstName":"Alex"//,"lastName":"Gluk"
          }
         )
        .project({"_id": false, "firstName": true, "lastName": 1})//"_id": false
        .toArray()
        .then(
          function(docs) {
            ////assert.equal(err, null);
            //assert.equal(3, docs.length);
            //console.log(`collection_Name content: ${docs}`);
            console.log(`collection_Name content.length: ${docs.length}`);
            //console.log("collection_Name content:\n%j", docs);
            for (var/*let*/ doc of docs) {
              console.log(JSON.stringify(doc));
            }

            db.close();
          }
        )
        .catch(
          function(e) {
            console.log(e);
          }
      );

    }
  }
);
}

exports.clear_Links = clear_Links;
exports.get_Collection = get_Collection;
exports.create_Unique_Index = create_Unique_Index;
exports.add_Docs = add_Docs;
exports.bulk_Docs_Insert = bulk_Docs_Insert;
exports.make_Unique_Link = generate_Unique_Short_Link;
exports.find_Short_Link = find_Short_Link;