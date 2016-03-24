"use strict";
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
/*
? http ?
for
https://api-url-shortener-microservice.herokuapp.com/
*/
const http = require('http');
const https = require('https');
//const fs = require('fs');  
//const path = require('path');
const url = require('url');
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
// for correct connection using .env 
// use `heroku local` or `heroku open [<url.path>]`
const mongo = require('mongodb').MongoClient;
if (is_Debug_Mode){
  console.log('mongo: %j', mongo);
}
const assert = require('assert');
const collection_Name = (
  //"docs" // <- for tests only
  "links"  
);
// exports.get_Short_Link = short_Link_Generator;
const short_Link_Gen = require('./short_link_generator.js');//.short_Link_Generator;
// redundat here, has no practical use
const end_Points_List = [
  "/",
  "/new"//, // special entry point
  //"/home",
  //"/help",
  //"/info"
];

var input_args_list = process.argv;
var node_ = input_args_list[0];
var self_file_path = input_args_list[1];
var document_Obj = {
  'firstName': "Alex",//first_Name,
  'lastName': "Gluk"//last_Name
};
// instead fetch template
var index_Template_Content_List = [
  '<html>',
    '<head>',
      '<title>URL Shortener Microservice</title>',
      '<link rel="icon" type="image/x-icon"',
      'href="favicon.ico" />',
      //'<link rel="stylesheet" type="text/css" href="/main.css"/>',
      '<style>',
        'body {',
          'background-color: lightblue;',
        '}',
        'h1 {',
          'text-decoration: underline;',
        '}',  
        'h3 {',
          'border-left-style: solid;',
          'border-left-color: green;',
          'border-left-width: thick;',
        '}',  
        'p {',
          'color: green;',
          'text-align: center;',
        '}',
        'li p {',
          'color: blue;',
          'text-align: left;',
        '}',
        'code {',
          'color: Chocolate;',
          'background-color: white;',
        '}',
      '</style>',
    '</head>',
    '<body>',
      '<h1>API Basejump: URL Shortener Microservice</h1>',
      '<section>',
        '<h3>Objective:</h3>',        
        '<p>Build a full stack JavaScript app<br>', 
        'that is functionally similar to this:<br>',
        '<a href="https://shurli.herokuapp.com">reference case</a> and<br>', 
        'deploy it to Heroku.</p>',
        '<h3>User story:</h3>',        
          '<ul>',
            '<li>',
              '<p>user can<br>',
              'pass a <var>URL</var> as a parameter and than<br>',
              'receive a shortened <var>URL</var> in the <code>JSON</code> response.</p>',
            '</li>',
            '<li>',
              '<p>If user pass an invalid <strong>URL</strong><br>',
              'that doesn\'t follow the valid <mark><code>http://www.example.com</code></mark> format,<br>',
              'the <strong>JSON</strong> response will contain<br>',
              'an <i>error</i> instead.</p>',
            '</li>',
            '<li>',
              '<p>When user visit that shortened URL,<br>',
              'that will redirect she to the original link</p>',
            '</li>',
          '</ul>',    
      '</section>',  
      '<section>',  
        '<h3>Example usage (live demo):</h3>',        
          '<ul>',
            '<li>',
              '<a href="https://api-url-shortener-microservice.herokuapp.com/new/https://github.com/GlulkAlex/URL_Shortener_Microservice">',
                'https://api-url-shortener-microservice.herokuapp.com/new/&lt;valid URL&gt;</a>', 
            '</li>',
            '<li>',
              '<a href="https://api-url-shortener-microservice.herokuapp.com/new/htps://github./GlulkAlex/URL_Shortener_Microservice?allow=true">',
                'https://api-url-shortener-microservice.herokuapp.com/new/&lt;<b>invalid</b> URL&gt;?allow=true</a>', 
            '</li>',
            '<li>',
              '<a href="https://api-url-shortener-microservice.herokuapp.com/cnn">',
                'https://api-url-shortener-microservice.herokuapp.com/&lt;<i>short</i> URL&gt;</a>',
            '</li>',
          '</ul>',
        '<h3>Example output:</h3>',        
          '<ul>',
            '<li>',
              '<code>{ "original_url": "http://freecodecamp.com/news", "short_url": "https://api-url-shortener-microservice.herokuapp.com/QqZ" }</code>',
            '</li>',
          '</ul>',      
      '</section>',        
    '</body>',
  '</html>'
];
var index_Template_Content_Str = index_Template_Content_List.join("\n");
var getter = https;
var response_Body; 
var source_Link = "";
var links_Count = 0;

// helper
function send_JSON_Response(
  // obj -> writable stream
  response,
  json_Response_Obj,
  // context 
  message  
) {
  message = message ? message : 'res.on "end"'; 
  console.log(`from send_JSON_Response, is response.headersSent: ${response.headersSent}`);
  /*
  response.finished
  Boolean value that indicates 
  whether the response has completed. 
  Starts as 'false'. 
  After 'response.end()' executes, 
  the value will be true.
  */
  console.log(`from send_JSON_Response, is response.finished: ${response.finished}`);
  if (response.finished) {
    console.log('response.end() occur already. Nothing will be written as / to response.');
  } else {
    console.log(message, 'json_Response_Obj: %j', json_Response_Obj);
    response
      .writeHead(
      200, 
      { 'Content-Type': 'application/json' }
    ); 
    //* close `writable` `stream` *
    response
      //.write(
      .end(
        //TypeError: Converting circular structure to JSON
        JSON
        .stringify(                
          json_Response_Obj  
        )
    );
    //response.end();
    console.log(message, 'response.end()'); 
  }
    
  //return ;//null; //void //Unit
}

// helper
function insert_Link_To_DB(
  db,
  collection,
  request,
  response,
  source_Link,
  context_Message
){
  "use strict";

  var collection_Size = 0;
  var short_Link; //= "";
  //var source_Link;
  var json_Response_Obj = {};
  var document_Obj = {};

  if (context_Message) {
  } else {
    context_Message = "request.on 'end' query.allow insertOne";
  }
  collection
    .find()
    .count()
    .then((count) => {
        console.log('(collection / cursor).count:', count);
        collection_Size = count;
      }
    )
    .catch((err) => {
        console.log('(collection / cursor).count error:', err.message);
      }
  );

  short_Link = short_Link_Gen
    .get_Short_Link(
      // must be found first <- crucial / almost mandatory
      collection_Size,
      // redundant / not used
      source_Link
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

  collection
    // insertOne(doc, options, callback) => {Promise}
    .insertOne(
      document_Obj
      //JSON.stringify(document_Obj)
    )
    .then(
      (result//.result.n
      ) => {
        //console.log(JSON.stringify(document_Obj));
        console.log('inserted document_Obj: %j', document_Obj);
        if (
          true
          //is_Debug
        ) {
          console.log(`result.result.n: ${result.result.n}`);
          //console.log('result.result: %j', result.result);
        }
        send_JSON_Response(
          // obj -> writable stream
          response,
          json_Response_Obj,
          // context
          context_Message
        );

        /* finaly */
        db.close();
        console.log(`Close db after link search & insert `);
      }
    )
    .catch(
      (err) => {
        // "E11000 duplicate key error index:
        console.log('(collection / cursor).insertOne error:', err.message);
        json_Response_Obj = {
          "error": err.message,
          "message": ".insertOne new:" + short_Link +
          " catch error when query.allow"
        };
        send_JSON_Response(
          // obj -> writable stream
          response,
          json_Response_Obj,
          // context
          'request.on "end" query.allow .insertOne catch error'
        );
      }
  );

  return //null;//side effect //void //Unit
}

if (input_args_list.length >= 3) {
  //first_Name = input_args_list[2].trim();
}

//server listen on [object Object]
//console.log(`server listen on ${address}`);
// %j work as JSON.stringify -> flatten object
//server listen on {"address":"127.0.0.1","family":"IPv4","port":8080}
console.log('process.env.MONGO_URI: %j', mongo_URI);
console.log('process.env.MONGOLAB_URI: %j', mongoLab_URI);

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

var http_Server = http.createServer(
  function (
    request,
    response
  ) {  
    "use strict";
    // request handling logic... 
    var collect_result_Str = "";
    var post_Data;
    // ** site structure ** //    
    var end_Points_List = [
      // `root` for instructions  
      '/',  
      // '/new/<valid_URL>'  
      // '/new/http://freecodecamp.com/news' 
      // '/new/<invalid_URL>?allow=true'  
      // for link creation  
      "/new"
      // all else redirect to `root`  
    ];
    var url_Obj = {};
    var query_Obj = {};
    var query_List = [];
    var query_Allow_Prop = false;  
    var source_Link = "";
    var short_Link = "";  
    var json_Response_Obj = {}; 
    // links
    // links_Count
    var collection_Size = 0;  
    /*    
    request.on(
      'connect', 
      (res, socket, head) => {
        console.log('request.on "connect"');
      }
    );
        
    request.on(
      'socket', 
      (socket) => {
        console.log('request.on "socket"');
      }
    );
    */ 
    /*
    If you do not want 
    to `consume` the data from a `stream`, but 
    you do want to 
    get to its 'end' event, 
    you can 
    call 'stream.resume()' 
    to `open` the `flow` of `data`.
    
    readable.resume()
      Return: this
      This method will 
      cause the `readable` `stream` 
      to `resume` `emitting` 'data' events.
    */
    // ? consume request body ?
    request.resume();  
    /* .on "data" must be enabled 
    it seems that it work in pair with .on "end" event   
    request.on(
      'data', 
      (chunk) => {
        console.log('request.on "data"');
        console.log(`request.method: ${request.method}`);
        console.log(`request.url: ${request.url}`);
        //console.log('request.on "data" chunk: %j', chunk); 
        console.log('request.on "data" chunk:', chunk);    
      }
    );
    */    
    request.on(
      'end', 
      () => {
        /*
        cases:
        - / | root -> instructions
        - /new<link>[options] -> short_Link | error
        - /<short_Link> -> redirect to <original_link> | error
        - /<path>/[whatever] -> redirect to / | root
        */
        console.log('request.on "end"');
        if (
          true
          //is_Debug_Mode
        ) {
          console.log(`request.on "end" request.url: ${request.url}`);
          //request.headers.referer: http://localhost:8080/new/https://devcenter.heroku.com/articles/getting-started-with-nodejs
          // all hash part #push-local-changes is lost
          // it seems like hash part is (for) client / front-end only
          /*
          so, does this really matter ?
          */
          console.log(`request.on "end" request.headers.referer: ${request.headers.referer}`);
          // from http://expressjs.com/en/api.html#req
          /*
          console.log(`request.on "end" request.baseUrl: ${request.baseUrl}`);
          console.log(`request.on "end" request.hostname: ${request.hostname}`);
          console.log(`request.on "end" request.ip: ${request.ip}`);
          console.log(`request.on "end" request.originalUrl: ${request.originalUrl}`);
          console.log(`request.on "end" request.path: ${request.path}`);
          console.log(`request.on "end" request.protocol: ${request.protocol}`);
          console.log(`request.on "end" request.query: ${request.query}`);
          */
          /*
          var prop_Count = 0;
          var prop;
          var prop_Indx;
          for (
            //var prop of src
            //prop_Indx in request
            prop_Indx in request.headers
          ) {
            if (prop_Count > 50) { 
              break;
            } else {
              prop = (
                //request[prop_Indx]
                request.headers[prop_Indx]
              );
              if (typeof(prop) == "function") {
                console.log(`request[${prop_Indx}]: function`);
              } else {  
                console.log(`request[${prop_Indx}]: ${prop}`);
              }
            }
            prop_Count += 1;
          }
          */
        }
        if (request.method == 'GET' ) {
        } 
        /*
        -e, --eval script     evaluate script
        -p, --print           evaluate script and print result
        */
        //node -pe "require('url').parse('/test?q=1', true)" 
        url_Obj = url.parse(request.url, true);
        query_Allow_Prop = url_Obj.query.allow;
        //console.log(`url_Obj.pathname: ${url_Obj.pathname}`);
        /*
        query_List = [];
        for(var item in url_Obj.query){
          query_List.push(item);
          query_List.push(url_Obj.query[item]);
        } 
        console.log('request.on "end" query_List\n%j:', query_List);
        */
        console.log('request.on "end" query_Allow_Prop:', query_Allow_Prop);
        console.log('request.on "end" url_Obj\n%j:', url_Obj);
        /*
        url formal correctness check:
            Url {
              protocol: 'htts:',
              slashes: true,
              auth: null,
              host: 'new',
              port: null,
              hostname: 'new',
              hash: null,
              search: '?allow=true',
              query: { allow: 'true' },
              pathname: '/invalid',
              path: '/invalid?allow=true',
              href: 'htts://new/invalid?allow=true' }
        url_Obj.protocol 'http' or 'https' 
        url_Obj.host is alphaNumeric and 
          has one or more non consequtive dots '.' within
        url_Obj.pathname starts with '/new'     
        url_Obj.query is non empty object   
        
        reference test case:
        https://shurli.herokuapp.com/new/httpp://freecodecamp/.com/news
        {"error":
          {"code":"ENOTFOUND",
          "errno":"ENOTFOUND",
          "syscall":"getaddrinfo",
          "hostname":"httpp:",
          "host":"httpp:",
          "port":80}}
        https://shurli.herokuapp.com/new/http://freecodecamp/.com/news  
        {"error":
          {"code":"ENOTFOUND",
           "errno":"ENOTFOUND",
           "syscall":"getaddrinfo",
           "hostname":"freecodecamp",
           "host":"freecodecamp",
           "port":80}}
        request:
        https://shurli.herokuapp.com/4k
        or
        https://shurli.herokuapp.com/new/?link=http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#find
        response: {"error":"No short url found for given input"}
        */
        /*
        http.get(options[, callback])#
        Since most requests are 
        GET requests 
        without bodies, 
        Node.js provides this convenience method. 
        The only difference 
        between this method and 
        http.request() is that 
        it sets the method to GET and 
        calls req.end() automatically.

        Example:
        */
        if (false) {          
        }  
        // 'host/' & 'host' both return {path: '/', pathname: '/'} 
        console.log(`request.on "end" url_Obj.path: ${url_Obj.path}`);  
        /***************/
        /*** routing ***/
        /***************/
        if (
          url_Obj.path == end_Points_List[0] //||
          //url_Obj.path == end_Points_List[2] ||
          //url_Obj.path == end_Points_List[3] ||
          //url_Obj.path == end_Points_List[4]
        ) {    
            /*
            browser cache may prevent proper routing
            if it decides that page content is not changing
            ? use E-Tag ?
            */
            console.log('request.on "end" path:', url_Obj.path, 'route:', end_Points_List[0]);
            //response_Body = "Try route `/api/whoami`";            
            response_Body = index_Template_Content_Str
            //303 See Other	
            // The requested page can be found under a different URL
            response
            .writeHead(
              200, 
              {
                'Content-Length': Buffer.byteLength(response_Body, 'utf8'),
                // content-type:text/html; charset=UTF-8  
                'Content-Type': 'text/html'//'text/plain'
              }
            );
            response.write(
              response_Body,
              'utf8'
            );
            response.end();
        } else if (
          // checking match for "/new/" (not just "/new")
          url_Obj.path.slice(0, 5) == "/new/" &&//end_Points_List[1] + "/" 
          url_Obj.path.length > "/new/".length
        ) {
          /*
          {"protocol":"http:",
          "slashes":true,"auth":null,
          "host":"freecodecamp.com","port":null,
          "hostname":"freecodecamp.com","hash":null,
          "search":"?allow=true","query":{"allow":"true"},
          "pathname":"/news/",
          "path":"/news/?allow=true",
          "href":"http://freecodecamp.com/news/?allow=true"}
          */
          source_Link = url_Obj.path.slice(5);
          console.log('request.on "end" source_Link:', source_Link);
          if (
            true
            //source_Link.length > 0
          ) {
            console.log('request.on "end" something after "new/" in:', url_Obj.path);
            url_Obj = url.parse(source_Link, true);
            //console.log(`url_Obj.pathname: ${url_Obj.pathname}`);
            // ? redundant ?
            //query_Allow_Prop = url_Obj.query.allow;
            console.log('request.on "end" source_Link url_Obj\n%j:', url_Obj);
            // `allow`
            if (
              //url_Obj.query.allow
              //url_Obj.search != "" && url_Obj.query != {}
              query_Allow_Prop
            ) {
              // ? replace `search` with "" ?
              // skip `search` & all after `search`
              source_Link = source_Link.slice(0, source_Link.indexOf("?"));
              console.log(
                `query_Allow_Prop: ${query_Allow_Prop}, so source_Link: ${source_Link} considered to be correct`);
              /*
              1. check MongoDB if `source_Link` exist already
                1.1 if true -> return stored `short_Link`
                1.2 else -> return `collection_Size`
                  1.2.1 generate `short_Link`
                  1.2.2 store pair / tuple {`source_Link`, `short_Link`}
                  1.2.3 return generated & stored `short_Link`
              */
              // for correct .env use `heroku local`
              mongo
                .connect(
                  //url, 
                  mongoLab_URI
                )
                .then(
                  (db) => {
                    "use strict";    
                    // db gives access to the database
                    // scope ?
                    const collection = db.collection(collection_Name);

                    // count(applySkipLimit, options, callback) => {Promise}
                    // Get the `count` of `documents` for this `cursor`
                    /*
                    new Promise(executor);
                    new Promise(function(resolve, reject) { ... });
                    */
                    // count(query, options, callback) => Promise
                    console.log(`trying to find original_url == ${source_Link} in ${collection_Name}`);
                    var cursor = collection
                      // has content / items for search
                      /*
                      find(query) => {Cursor}
                        Creates a `cursor`
                        for a `query`
                        that can be used
                        to iterate over `results` from MongoDB

                      Cursor#event:readable
                      so stream and
                      can be piped
                      */
                      //find().limit(1).next(function(err, doc){})
                      .find(
                        {
                          //"short_url":"Alex"
                          // [ReferenceError: short_Link is not defined]
                          "original_url": source_Link
                        }
                      )
                      // use index
                      //.hint('original_url')
                      .limit(1)
                      .project({"_id": false, "original_url": true, "short_url": 1})
                      //.toArray()
                      // next(callback) => {Promise}
                      // Get the next available `document` from the `cursor`,
                      // returns 'null' if no more `documents` are available.
                      .next()
                      //  (err, doc) => {
                      .then(
                        (doc) => {
                          console.log(`query on ${collection_Name} content: ${doc}`);
                          //console.log(`collection ${collection_Name} content.length: ${docs.length}`);
                          //console.log("collection_Name content:\n%j", docs);

                          if (
                            doc // doc != null
                            //docs.length > 0
                            //({}).hasOwnProperty("b")
                            //doc.hasOwnProperty("original_url")
                          ) {
                            // found
                            json_Response_Obj = {
                              //[TypeError: Cannot read property 'original_url' of undefined]
                              "original_url": (
                                // source_Link
                                doc.original_url
                                //docs[0].original_url
                              ),
                              "short_url": doc.short_url,
                              "message": "stored link retrieved"
                            };
                          } else {
                            // has no previously stored `link`
                            // not found => new
                            // must be unique within `link` collection
                            // otherwise generate error on insert
                            // so, check for duplicate first / query mogoDB ?
                            // or insert new(ly) generated link every time
                            // until success ?
                            collection
                              .find()
                              .count()
                              .then((count) => {
                                  console.log('(collection / cursor).count:', count);
                                  collection_Size = count;
                                }
                              )
                              .catch((err) => {
                                  console.log('(collection / cursor).count error:', err.message);
                                }
                            );
                            short_Link = short_Link_Gen
                              .get_Short_Link(
                                // must be found first <- crucial / almost mandatory
                                collection_Size,
                                // redundant / not used
                                source_Link
                            );
                            json_Response_Obj = {
                              // ? mast contain query without allow ?
                              /*
                              {"protocol":"http:",
                              "slashes":true,"auth":null,
                              "host":"freecodecamp.com","port":null,
                              "hostname":"freecodecamp.com","hash":null,
                              "search":"?allow=true","query":{"allow":"true"},
                              "pathname":"/news/",
                              "path":"/news/?allow=true",
                              "href":"http://freecodecamp.com/news/?allow=true"}
                              */
                              "original_url": (
                                //(url_Obj.protocol ? url_Obj.protocol + "//" : "") +
                                //(url_Obj.host ? url_Obj.host : "") +
                                //url_Obj.pathname
                                source_Link
                              ),
                              "short_url": (request.socket.encrypted ? 'https://' : 'http://') +
                              request.headers.host + "/" +
                              // may create duplicates
                              // additional check needed
                              short_Link,
                              "message": "new link stored"
                            }
                          };

                          document_Obj = {
                            "original_url": json_Response_Obj.original_url,
                            "short_url": short_Link
                          };

                          // not DRY
                          // to many copy->paste
                          collection
                            // insertOne(doc, options, callback) => {Promise}
                            .insertOne(
                              document_Obj
                              //JSON.stringify(document_Obj)
                            )
                            .then(
                              (result//.result.n
                              ) => {
                                //console.log(JSON.stringify(document_Obj));
                                console.log('inserted document_Obj: %j', document_Obj);
                                if (
                                  true
                                  //is_Debug
                                ) {
                                  console.log(`result.result.n: ${result.result.n}`);
                                  console.log('result.result: %j', result.result);
                                }
                                send_JSON_Response(
                                  // obj -> writable stream
                                  response,
                                  json_Response_Obj,
                                  // context
                                  'request.on "end" query.allow insertOne'
                                );

                                /* finaly */
                                db.close();
                                console.log(`Close db after link search & insert `);
                              }
                            )
                            .catch(
                              (err) => {
                                // "E11000 duplicate key error index:
                                console.log('(collection / cursor).insertOne error:', err.message);
                                json_Response_Obj = {
                                  "error": err.message,
                                  "message": ".insertOne new:" + short_Link +
                                  " catch error when query.allow"
                                };
                                send_JSON_Response(
                                  // obj -> writable stream
                                  response,
                                  json_Response_Obj,
                                  // context
                                  'request.on "end" query.allow .insertOne catch error'
                                );
                              }
                          );
                        }
                      )
                      .catch((err) => {
                          console.log('(collection / cursor).find error:', err.message);
                          json_Response_Obj = {
                            "error": err.message,
                            "message": ".find:" + short_Link + " catch error when query.allow"
                          };
                          send_JSON_Response(
                            // obj -> writable stream
                            response,
                            json_Response_Obj,
                            // context
                            'request.on "end" query.allow .find catch error'
                          );
                        }
                      );                        

                  }
                )
                .catch((err) => {
                  console.log('mongo.db.connect error:', err.message, ";when query.allow");
                  json_Response_Obj = {
                    "error": err.message,
                    "message": "mongo.db.connect catch error when query.allow"
                  };
                  send_JSON_Response(
                    // obj -> writable stream
                    response,
                    json_Response_Obj,
                    // context
                    'request.on "end" query.allow mongo.db.connect catch error'
                  );
                }
              );
              
            } else {
              // hyphens (-), underscores (_)
              /*
              cases:
              - check "protocol": http | https
              - check "host": /(([A-z0-9-_])+\.([A-z0-9-_])+)+/ig
                /^([^\W\s]+)((\.)([^\W\s]+))*((\.)([^\W\s]+))$/g.exec("1freecode.25.ca.h");
              - check http.get result / status code
                OK ?
                1xx: Information
                  100 Continue
                2xx: Successful
                  200 OK
                3xx: Redirection
                  303 See Other
                not OK
                4xx: Client Error
                  400 Bad Request
                  404 Not Found
                5xx: Server Error 
                  505 HTTP Version Not Supported
              */
              console.log(`Checking url_Obj.protocol: ${url_Obj.protocol}`);            
              if (
                url_Obj.protocol == "http:" || 
                url_Obj.protocol == "https:"
              ) {
                console.log(`Checking url_Obj.host: ${url_Obj.host}`);
                if (
                  /^([^\W\s]+)((\.)([^\W\s]+))*((\.)([^\W\s]+))$/g.test(url_Obj.host) 
                ) {
                  console.log(`Checking link: ${source_Link} in www`);
                  //Error: Protocol "https:" not supported. Expected "http:"
                  //http
                  getter = url_Obj.protocol == "http:" ? http : https;
                  getter
                    .get(
                      // extracted link (if any) goes here
                      //'http://www.google.com/index.html', 
                      source_Link,
                      (res) => {
                        // 302 Found	The requested page has moved temporarily to a new URL   
                        console.log(`Got response: ${res.statusCode}`);
                        /*
                        // to consume response body
                        // or use 'res.resume()';
                        res.on('data', (d) => {
                          // page content goes here
                          process.stdout.write(d);
                        });
                        */
                        /* async so parent process must await for result */
                        json_Response_Obj = {
                          "get_Response": res.statusCode,
                          "source_Link": source_Link
                        };  
                        console.log('request.on "end" http.get json_Response_Obj: %j', json_Response_Obj);

                        /*
                        readable.pipe(destination[, options])
                          destination <stream.Writable> The destination for writing data
                          options <Object> Pipe options
                            end <Boolean> End the writer when the reader ends. Default = true
                        */
                        //reader
                        /*
                        res
                          .pipe(
                          //writer
                          response//, 
                          //{ end: false }
                        );
                        */
                        /**/
                        //reader
                        res
                          .on(
                            'end', 
                            () => {
                              console.log(`Checking MongoDB for stored source_Link: ${source_Link}`);
                              if (res.statusCode < 400) {
                              mongo
                              .connect(
                                mongoLab_URI//,
                              )
                              .then(
                                //null,
                                (
                                  //err, 
                                  db
                                ) => {
                                  "use strict";
                                  // db gives access to the database
                                  // scope ?
                                  //const 
                                  var collection = db.collection(collection_Name);

                                  var cursor = collection
                                  .find(
                                    {
                                      "original_url": source_Link
                                    }
                                  )
                                  // use index
                                  // ? must be 'text index' ?
                                  // A collection can have at most one 'text' index.
                                  // But it is possible to
                                  // index multiple fields for the 'text' index.
                                  // `hint` or more likely `indexes` fails
                                  //.hint('original_url')
                                  //.hint("_fts")
                                  //.hint("_ftsx")
                                  .limit(1)
                                  .project({"_id": false, "original_url": true, "short_url": 1})
                                  // toArray(callback) => {Promise}
                                  .toArray()
                                  .then(
                                    (docs) => {
                                      console.log('find result: %j', docs); 
                                      if (docs.length > 0) {
                                        console.log(`source_Link:${source_Link} found, result:${docs[0].short_url}`);
                                        json_Response_Obj = {
                                          "get_Response": res.statusCode,
                                          "source_Link": source_Link,
                                          "short_url": docs[0].short_url,
                                          "message": "Short link found"
                                        };
                                        send_JSON_Response(
                                          // obj -> writable stream
                                          response,
                                          json_Response_Obj,
                                          // context 
                                          'res.on "end" cursor.find found'  
                                        );
                                      } else {
                                        console.log(`source_Link:${source_Link} not found, creating one`);
                                        /*
                                        json_Response_Obj = {
                                          "get_Response": res.statusCode,
                                          "source_Link": source_Link,
                                          "message": "Short link not found"
                                        };
                                        send_JSON_Response(
                                          // obj -> writable stream
                                          response,
                                          json_Response_Obj,
                                          // context 
                                          'res.on "end" cursor.find not found'  
                                        );
                                        */
                                        insert_Link_To_DB(
                                          db,
                                          collection,
                                          request,
                                          response,
                                          source_Link,
                                          //context_Message
                                          "res.on 'end' cursor.find not found"
                                        );
                                      }
                                    }
                                  )
                                  .catch(
                                    (e) => {
                                      // Unable to execute query: 
                                      // error processing query: 
                                      // ns=heroku_4mwk4dd8.links limit=1 skip=0
                                      console.log(`catch error on mongoDB find cursor: ${e.message}`); 
                                      json_Response_Obj = {
                                        "get_Response": res.statusCode,
                                        "source_Link": source_Link,
                                        "message": e.message
                                      };
                                      send_JSON_Response(
                                        // obj -> writable stream
                                        response,
                                        json_Response_Obj,
                                        // context 
                                        'res.on "end" cursor.find catch error'  
                                      );
                                    }
                                  );
                                }
                              )
                              .catch(
                                (e) => {
                                  console.log(`catch error on mongoDB connect: ${e.message}`);
                                  json_Response_Obj = {
                                    "get_Response": res.statusCode,
                                    "source_Link": source_Link,
                                    "message": e.message                                    
                                  };
                                  send_JSON_Response(
                                    // obj -> writable stream
                                    response,
                                    json_Response_Obj,
                                    // context 
                                    'res.on "end" cursor.find'  
                                  );
                                }
                              );
                    
                              //writer
                              //  .end('Goodbye\n'); 
                            } else {
                              console.log(`source_Link: ${source_Link} not found in www`);
                              json_Response_Obj = {
                                "get_Response": res.statusCode,
                                "source_Link": source_Link,
                                "message": "source_Link not found in www"                                    
                              };
                              send_JSON_Response(
                                // obj -> writable stream
                                response,
                                json_Response_Obj,
                                // context 
                                'res.on "end" cursor.find'  
                              );
                            }                                                           
                          }
                        );
                        /**/
                        //res
                        //  .unpipe(/*writer*/response);
                        /*
                        response
                          .writeHead(
                            200, 
                            { 'Content-Type': 'application/json' }
                        ); 
                        response
                          .end(
                            JSON
                              .stringify(
                                json_Response_Obj  
                            )
                        ); 
                        console.log('request.on "end" http.get response.end()');
                        */
                        // readable.on('readable', () => {});
                        /*
                        if you add a 'response' event handler, then 
                        you must `consume` the 'data' 
                        from the `response` object, 
                        either 
                        by calling 'response.read()' 
                        whenever there is a 'readable' `event`, or 
                        by adding a 'data' `handler`, or 
                        by calling the '.resume()' method. 
                        Until the 'data' is `consumed`, 
                        the 'end' `event` will not `fire`. 
                        Also, 
                        until the 'data' is `read` 
                        it will `consume` 'memory' 
                        that can 
                        eventually lead to 
                        a 'process out of memory' error.
                        */
                        // consume response body
                        res.resume();
                      }
                  ).on(
                      'error', 
                      (e) => {
                        console.log(`Got error: ${e.message}`);
                        json_Response_Obj = {
                          "error": e.message
                        };
                        send_JSON_Response(
                          // obj -> writable stream
                          response,
                          json_Response_Obj,
                          // context 
                          'request.on "end" error'  
                        );
                      }
                  );
                } else {
                  json_Response_Obj = {
                    "error": "bad URL host"
                  };
                  send_JSON_Response(
                    // obj -> writable stream
                    response,
                    json_Response_Obj,
                    // context 
                    'request.on "end" error'  
                  );

                }
              } else {
                // false positive on https://api-url-shortener-microservice.herokuapp.com/newFGhj
                // reaction on `path` starting with 'new'
                // so it must be followed by '/'
                // in order to be not part of a short_Link
                json_Response_Obj = {
                  "error": "bad URL protocol"
                };

                send_JSON_Response(
                  // obj -> writable stream
                  response,
                  json_Response_Obj,
                  // context 
                  'request.on "end" error'  
                );
              }
            }
            
          } else {
            console.log('request.on "end" nothing after "new" in:', url_Obj.path);
            json_Response_Obj = {
              "error": 'Nothing after "new" found in URL. Link expected.'
            };  
            send_JSON_Response(
              // obj -> writable stream
              response,
              json_Response_Obj,
              // context 
              'request.on "end" error'  
            );
          }
        } else {
          /* Redirection */ 
          /*
          cases:
          - /<short_Link> -> redirect to <original_link> | error
          - /<path>/[whatever] -> redirect to / | root
          */
          console.log('request.on "end" not "root"');    
          console.log('request.on "end" -> Redirection');
          short_Link = url_Obj.path.slice(1);
          console.log('Checking short_Link', short_Link, "format"); 
          // "net/.html".indexOf("\/") != -1
          if (
            //url_Obj.path.indexOf("\/") == -1
            // /^[A-z]+$/g.exec("netHtml");
            /^[A-z]+$/g.test(short_Link)
          ) {
            // search for entry in db
            console.log('request.on "end" "path" matches expected "short_Link" format'); 
            console.log('searching for original link in db ...'); 
            
            // for correct .env use `heroku local`
            //static MongoClient.connect(url, options, callback) => {Promise}
            mongo
              .connect(
                //url, 
                mongoLab_URI, 
                // Authenticate -> success
                // but callback -> error / fails
                //connectCallback(error, db)
                (
                  err, 
                  db
                ) => {
                  "use strict";
                  // db gives access to the database
                  if (err) {
                    console.log('mongo.connect error:', err);
                    //throw err;
                    json_Response_Obj = {
                      "message": 'searching for original link in db ...',
                      "result": err.message
                    };  
                    send_JSON_Response(
                      // obj -> writable stream
                      response,
                      json_Response_Obj,
                      // context 
                      'Redirection mongo.connect'  
                    );
                  } else {
                    // scope ?
                    //const 
                    var collection = db.collection(collection_Name);
                    
                    // Peform a find to get a cursor
                    //var stream = //collection.find().stream();
                    var cursor = 
                    collection
                      .find(
                        {
                          "short_url": short_Link
                        }
                      )
                      // use index
                      //.hint('original_url')
                      .limit(1)
                      .project({"_id": false, "original_url": true, "short_url": 1});
                      //.stream();
                    
                    // hasNext(callback) => {Promise}
                    // Check if 
                    // there is any `document` still available in the `cursor`
                    // Perform hasNext check
                    cursor
                      .hasNext(
                        //(err, r) => {
                          //test.equal(null, err);
                          //test.ok(r);
                      ).then((r) => {
                        console.log(`cursor.hasNext.then`);
                      // next(callback) => {Promise}
                      // Get the next available `document` from the `cursor`, 
                      // returns null 
                      // if no more documents are available.
                      /*
                      By default, 
                      the server will automatically close the cursor 
                      after 10 minutes of inactivity, or 
                      if client has exhausted the cursor. 
                      To override this behavior in the mongo shell, 
                      you can use the cursor.noCursorTimeout() method
                      */
                      // inherited rewind() => {null}
                      // Resets the cursor
                      cursor.rewind();
                      cursor
                      .next(
                        //(next_err, doc) => {
                      ).then((doc) => {    
                          "use strict";
                          ////assert.equal(err, null);  
                          //assert.equal(1 || 0, docs.length);
                          console.log(`cursor.next.then`);
                          if (
                            //next_err
                            false
                          ) {
                            // error on mongoDB find: server ds011399-a.mlab.com:11399 sockets closed
                            //console.log(`error on mongoDB find ${original_url}: ${next_err.message}`);
                            json_Response_Obj = {
                              "message": 'searching for original link ' + source_Link + ' in db ...',
                              "result": false//next_err.message
                            };  
                            send_JSON_Response(
                              // obj -> writable stream
                              response,
                              json_Response_Obj,
                              // context 
                              'Redirection cursor.next'  
                            );
                          } else {

                            console.log(`${collection_Name} collection find({"short_url": ${short_Link}}) result: %j`, doc);
                            //console.log(`collection ${collection_Name} content.length: ${docs.length}`);  
                            //console.log("collection_Name content:\n%j", docs); 

                            //null ? true: false -> false
                            //if (null){"t";}else{"f";} => "f"
                            if (
                              doc &&
                              //typeof(null) == "object"
                              typeof(doc) == "object"
                              //docs.length > 0
                              //({}).hasOwnProperty("b")
                              //doc.hasOwnProperty("original_url")
                            ) {
                              // `short_Link` found
                              console.log(`cursor.next.then, is response.headersSent: ${response.headersSent}`);
                              console.log(`cursor.next.then, is response.finished: ${response.finished}`);
                              /*
                              json_Response_Obj = {
                                "original_url": doc.original_url, 
                                "message": 'searching for original link in db ...',
                                "result": doc//true
                              };  
                              send_JSON_Response(
                                // obj -> writable stream
                                response,
                                json_Response_Obj,
                                // context 
                                'Redirection cursor.next'  
                              );
                              */
                              response
                                .writeHead(
                                  //3xx: Redirection
                                  //301 Moved Permanently
                                  // The requested page has moved to a new URL
                                  301,
                                  {
                                    Location: doc.original_url
                                  }
                              );
                              response.end();
                              console.log(`response.end()`);
                              console.log(`Redirection to original_url: ${doc.original_url} ...`);
                              // Close db
                              //db.close();
                            } else {
                              // not found
                              json_Response_Obj = {
                                "message": 'searching for original link in db ...',
                                "result": "short link -> not found"//false
                              };  
                              send_JSON_Response(
                                // obj -> writable stream
                                response,
                                json_Response_Obj,
                                // context 
                                'Redirection cursor.next'  
                              );
                              // Close db
                              //db.close();
                            }
                            // Close db
                            db.close();
                            console.log(`Close db after search for original_url`);
                          }
                        }
                      )
                      .catch(
                      (err) => {
                        //catch error on mongoDB cursor.next: original_url is not defined
                        //catch error on mongoDB cursor.next: cursor is exhausted
                        //catch error on mongoDB cursor.next: 
                        // Cannot read property 'hasOwnProperty' of null
                        console.log(`catch error on mongoDB cursor.next: ${err.message}`);
                        json_Response_Obj = {
                          "message": 'searching for original link in db ...',
                          "error": err.message
                        };  
                        send_JSON_Response(
                          // obj -> writable stream
                          response,
                          json_Response_Obj,
                          // context 
                          'Redirection cursor.next catch error'  
                        );
                      }
                    );
                    })
                    .catch(
                      (err) => {
                        console.log(`catch error on mongoDB cursor.hasNext: ${err.message}`);
                        json_Response_Obj = {
                          "message": 'searching for original link in db ...',
                          "error": err.message
                        };  
                        send_JSON_Response(
                          // obj -> writable stream
                          response,
                          json_Response_Obj,
                          // context 
                          'Redirection cursor.hasNext catch error'  
                        );
                      }
                    );
                    
                    /*
                    // Execute find on all the documents
                    stream
                      .on('end', () => {
                      db.close();
                    });

                    stream
                      .on('data', (data) => {
                      //test.ok(data != null);
                      if (data) {
                        console.log(`stream on data ${data} true`);
                      } else {
                        console.log(`stream on data ${data} false`);
                      }
                    });
                    */
 
                  } 
                }
            );
                  
          } else {
            console.log('request.on "end" path not match expected "short_Link" format'); 
            console.log('request.on "end" Redirection to request.headers.host: ', request.headers.host);
            console.log(url_Obj.protocol + '://' + url_Obj.host);
            
            response
              .writeHead(
                //3xx: Redirection
                //301 Moved Permanently
                // The requested page has moved to a new URL 
                301, 
                {
                  Location: (
                    (request.socket.encrypted ? 'https://' : 'http://') +
                    // url_Obj.protocol: null <- screw all
                    //url_Obj.protocol + '//' +
                    request.headers.host// + end_Points_List[0]
                  )
                }
            );
            response.end();
            console.log('request.on "end", response.end(), Redirection to request.headers.host');
          } 
            
          //response
          //  .redirect(url_Obj.protocol + '://' + url_Obj.host);  
        }  
                
        /* close `writable` `stream` */
        //response.end();
        //console.log('request.on "end" response.end()');
      }
    );
    
    // using `stream` API
    //var writer = getWritableStreamSomehow();
    //var reader = getReadableStreamSomehow();

    //writer
    response
      .on(
        'pipe', 
        (src) => {
          console.error('something is piping into the writer');
          //assert.equal(src, reader);
          /*
          var prop_Count = 0;
          var prop;
          var prop_Indx;
          for (
            //var prop of src
            prop_Indx in src
          ) {
            if (prop_Count > 50) { 
              break;
            } else {
              prop = src[prop_Indx];
              if (typeof(prop) == "function") {
                console.log(`src[${prop_Indx}]: function`);
              } else {  
                console.log(`src[${prop_Indx}]: ${prop}`);
              }
            }
            prop_Count += 1;
          }
          */
          json_Response_Obj = {
            "get_Response": src.statusCode,
            /* not so much functional 
            source_Link is not a parameter
            but global state
            */
            "source_Link": source_Link
          }; 
          console.log('response.on "pipe" src json_Response_Obj: %j', json_Response_Obj);
          response
            .writeHead(
              200, 
              { 'Content-Type': 'application/json' }
          ); 
          response
            .end(
              //TypeError: Converting circular structure to JSON
              JSON
              .stringify(                
                json_Response_Obj  
              )
          );
          /* close `writable` `stream` */
          //response.end();
          console.log('response.on "pipe" response.end()');
          src.unpipe(response);
        }
    );
    //reader.pipe(writer);
    //reader.unpipe(writer);  
    response
      .on(
        'unpipe', 
        (src) => {
          console.error('something has stopped piping into the writer');
        }
    );
      
    response
      .on(
        'error', 
        (e) => {    
          console.log('response on "error"');  
          console.error(`e.code: ${e.code}, e.message: ${e.message}`);
        }
    );
      
  }
);  

http_Server
  .on(
    'connection', 
    (socket) => {
      //socket.localAddress
      //socket.localPort
      //console.log('http_Server on "connection" socket: %j', socket);
      console.log(`http_Server on "connection" socket: ${socket.localAddress}:${socket.localPort}`);
    }
);
/*
Emitted each time a client requests a http CONNECT method.
? like ?
Client request
GET /index.html HTTP/1.1
Host: www.example.com
POST /test/demo_form.asp HTTP/1.1 
Host: w3schools.com
name1=value1&name2=value2
? or only in the client request header ?
*/
/*
http_Server
  .on(
    'connect', 
    (res, socket, head) => {
      console.log('http_Server on HTTP/1.1 "CONNECT" method socket: %j', socket);
    }
);
*/
http_Server
  .on(
    'clientError', 
    (exception, socket) => {   
      console.log('http_Server on "clientError"');  
      console.error(`exception.code: ${exception.code}, exception.message: ${exception.message}`);
    }
);

http_Server
  .on(
    'error', 
    (e) => {    
      console.log('http_Server on "error"');  
      console.error(`e.code: ${e.code}, e.message: ${e.message}`);
    }
);
/*##########################################################################*/
/* unit test */
// Start a UNIX socket server 
// listening for connections on the given path.
http_Server
  .listen(
    port_Number,
    () => {
      var address = http_Server.address();
      var port = http_Server.address().port;
    
      console.log(
        `server listening address{${address.address}}:port{${address.port}}`
      );
      //console.log('http_Server listening on port ' + port + '...');
    }
);
