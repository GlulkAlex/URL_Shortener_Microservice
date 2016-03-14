/*
module API
must provide:
  insert document,
  find document,
  return collection size
*/
// const
var MongoClient = require('mongodb').MongoClient;
// const
var assert = require('assert');

var insert_Documents = function(
  db, 
  callback
) {
  // Get the `documents` collection
  var collection = db.collection('documents');
      
  // Insert some documents
  collection
    .insertMany(
      [
        {a : 1}, 
        {a : 2}, 
        {a : 3}
      ], function(
        err, 
        result
      ) {
        /*
        - `result` Contains 
            the result document from MongoDB
        - `ops` Contains 
            the documents inserted with added _id fields
        - `connection` Contains 
            the connection used to perform the insert
        */
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
            
        console.log("Inserted 3 documents into the document collection");
        callback(result);
      }
  );
}

var find_Documents = function(
  db, 
  callback
) {
  // Get the `documents` collection
  var collection = db.collection('documents');
  // Find some documents
  collection
    .find({})
    .toArray(
      function(
        err, 
        docs
      ) {
        assert.equal(err, null);
        //assert.equal(2, docs.length);
            
        console.log("Found the following records:");
        console.dir(docs)
        
        callback(docs);
      }
  );      
}

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient
  .connect(
    url, 
    function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      
      // nested calls  
      insert_Documents(
        db, 
        // callback
        function() {
          find_Documents(
            db, 
            function() {  
              db.close();
            }
          );
        }
      );
    }
);