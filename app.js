/*
.env
MONGO_URI=mongodb://localhost:27017/clementinejs
*/
const is_Debug_Mode = (
  process.env.IS_DEBUG ||
  process.argv[2]
  //true
  //false
);
const port_Number = (
  //process.argv[3] || 
  process.env.PORT || 
  //0 
  8080 ||
  3000
);
const mongo_URI = (
  process.env.MONGO_URI || 
  process.argv[3] || 
  "mongodb://localhost:27017/data"
);
//TEST_MONGODB
//MONGOLAB_URI:
const mongoLab_URI = (
  // must be on `.env` file or
  // in heroku config  
  // it is possible
  // to use the same config var 
  // in both local and Heroku environments  
  process.env.MONGOLAB_URI || 
  process.env.TEST_MONGODB ||   
  process.argv[3] || 
  "mongodb://localhost:27017/data_uri"
);
if (is_Debug_Mode){
  console.log('process.env: %j', process.env);
}
const mongo = require('mongodb').MongoClient;
if (is_Debug_Mode){
  console.log('mongo: %j', mongo);
}
const assert = require('assert');
const collection_Name = (
  "docs"
  //"links"  
);

var input_args_list = process.argv;
var node_ = input_args_list[0];
var self_file_path = input_args_list[1];
var document_Obj = {
  'firstName': "Alex",//first_Name,
  'lastName': "Gluk"//last_Name
};


if (input_args_list.length >= 3) {
  //first_Name = input_args_list[2].trim();
}

//server listen on [object Object]
//console.log(`server listen on ${address}`);
// %j work as JSON.stringify -> flatten object
//server listen on {"address":"127.0.0.1","family":"IPv4","port":8080}
console.log('process.env.MONGO_URI: %j', mongo_URI);
console.log('process.env.MONGOLAB_URI: %j', mongoLab_URI);

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
        .catch(function(e) {
          console.log(e); 
        }
      );  
        
    }
  }
);