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

exports.clear_Links = clear_Links;
exports.get_Collection = get_Collection;
exports.create_Unique_Index = create_Unique_Index;
exports.add_Docs = add_Docs;
exports.bulk_Docs_Insert = bulk_Docs_Insert;
exports.make_Unique_Link = generate_Unique_Short_Link;