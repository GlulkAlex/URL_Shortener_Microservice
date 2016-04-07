"use strict";
// TODO create an alternative start file: main.js using express
/*
.env
MONGO_URI=mongodb://localhost:27017/clementinejs
*/
//*** config ***//
//const
var env = () => {
  try {
    //env =
    return require('./.env.json');
  } catch(err) {
    console.warn("config file missing, so as actual connection info too");

    //env =
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

const is_Debug_Mode = (
  process.env.IS_DEBUG ||
  env.DEBUG_MODE.value ||
  process.argv[2]
  //true
  //false
);
/*
? http ?
for
https://api-url-shortener-microservice.herokuapp.com/
*/
//*** Node.js modules ***//
const http = require('http');
const https = require('https');
//var express = require('express');
//var app = express();
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
  //env.TEST_MONGODB.value ||
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
  env.TEST_MONGODB.value ||
  process.argv[3] ||
  "mongodb://localhost:27017/data_uri"
);
// inline condition
// !(true) || console.log('log'); => log
//JSON.stringify(value[, replacer[, space]])
if (is_Debug_Mode) {
  console.log(
    "process.env:",
    JSON.stringify(
      process.env
      ,['PORT', 'IS_DEBUG', 'DEBUG_MODE', 'MONGO_URI', 'MONGOLAB_URI', 'TEST_MONGODB']
      // works as "pretty print"
      ,'\t'
    )
  );}
// for correct connection using .env
// use `heroku local` or `heroku open [<url.path>]`
const mongo = require('mongodb').MongoClient;
//var MongoClient = mongo;
if (is_Debug_Mode) {
  //mongo.define.name == 'MongoClient'
  if (mongo.hasOwnProperty(define)) {
    console.log("mongo.define.name:", mongo.define.name);
  } else {
    console.log("typeof mongo:", typeof(mongo));
  }
}
const assert = require('assert');
const collection_Name = (
  //"docs" // <- for tests only
  "links"  
);

//*** application modules ***//
// exports.get_Short_Link = short_Link_Generator;
const short_Link_Gen = require('./short_link_generator.js');//.short_Link_Generator;
//var link_Gen = short_Link_Gen;
const host_Name_Validator = require('./host_Name_Validator.js');
const db_Helpers = require('./db_Helpers.js');
const response_Helpers = require('./response_Helpers.js');
//*** application modules end ***//

// redundant here, has no practical use
const end_Points_List = [
  "/"
  ,"/new" // special entry point
  //,"/home",
  //,"/help",
  //,"/info"
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
              '<a href="https://api-url-shortener-microservice.herokuapp.com/' +
              'new/https://github.com/GlulkAlex/URL_Shortener_Microservice">',
                'https://api-url-shortener-microservice.herokuapp.com/new/&lt;valid URL&gt;</a>', 
            '</li>',
            '<li>',
              '<a href="https://api-url-shortener-microservice.herokuapp.com/' +
              'new/htps://github./GlulkAlex/URL_Shortener_Microservice?allow=true">',
                'https://api-url-shortener-microservice.herokuapp.com/' +
                'new/&lt;<b>invalid</b> URL&gt;?allow=true</a>',
            '</li>',
            '<li>',
              '<a href="https://api-url-shortener-microservice.herokuapp.com/cnn">',
                'https://api-url-shortener-microservice.herokuapp.com/&lt;<i>short</i> URL&gt;</a>',
            '</li>',
          '</ul>',
        '<h3>Example output:</h3>',        
          '<ul>',
            '<li>',
              '<code>{ "original_url": "http://freecodecamp.com/news",' +
              '"short_url": "https://api-url-shortener-microservice.herokuapp.com/QqZ" }</code>',
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

/*
// to find string of specific length
// without dedicated 'length' field
{
  "short_url": {
    // to ensure schema correctness
    $exists: true,
    $type: <BSON type number>2 | <String alias>"string"
    "$regex": "/^[A-z]{3}$/"
  }
}
*/

if (input_args_list.length >= 3) {
  //first_Name = input_args_list[2].trim();
}

//server listen on [object Object]
//console.log(`server listen on ${address}`);
// %j work as JSON.stringify -> flatten object
//server listen on {"address":"127.0.0.1","family":"IPv4","port":8080}
if (is_Debug_Mode) {console.log('MONGO_URI is: %j', mongo_URI);}
if (is_Debug_Mode) {console.log('MONGOLAB_URI is: %j', mongoLab_URI);}


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
    var original_Link = "";
    var short_Link = "";
    var short_Link_Size = 1;
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
    request
    //.on(
    .once(
      'end', 
      () => {
        /*
        cases:
        - / | root -> instructions
        - /new<link>[options] -> short_Link | error
        - /<short_Link> -> redirect to <original_link> | error
        - /<path>/[whatever] -> redirect to / | root
        */
        if (is_Debug_Mode) {console.log("request.on \"end\"");}
        if (
          true
          //is_Debug_Mode
        ) {
          if (is_Debug_Mode) {console.log(
            "request.on \"end\" request.url:", request.url);}
          //request.headers.referer: http://localhost:8080/new/https://devcenter.heroku.com/articles/getting-started-with-nodejs
          // all hash part #push-local-changes is lost
          // it seems like hash part is (for) client / front-end only
          /*
          so, does this really matter ?
          */
          if (is_Debug_Mode) {console.log(
            "request.on \"end\" request.headers.referer:", request.headers.referer);}
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
        if (is_Debug_Mode) {console.log('request.on "end" query_Allow_Prop:', query_Allow_Prop);}
        if (is_Debug_Mode) {console.log("request.on \"end\" url_Obj\n:", JSON.stringify(url_Obj, null, '\t'));}
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
        if (is_Debug_Mode) {console.log("request.on(\"end\") url_Obj.path:", url_Obj.path);}

        // TODO https://api-url-shortener-microservice.herokuapp.com/new/https://devcenter.heroku.com/articles/getting-started-with-nodejs#push-local-changes => {"error":"Parse Error"}
        //heroku[router]: at=error code=H13 desc="Connection closed without response"
        //method=GET path="/new/https://devcenter.heroku.com/articles/getting-started-with-nodejs"
        //app[web.1]: request.on "end" path: / route: /
        //app[web.1]: http_Server on "connection" socket:
        //app[web.1]: events.js:141
        //app[web.1]:       throw er; // Unhandled 'error' event
        // ? http-parser to version 1.1
        // includes parsing improvements to ensure closer HTTP spec conformance ?
        // "HPE_UNEXPECTED_CONTENT_LENGTH: Parse Error"
        // The problem seems to occur when
        // "Content-Length": <whatever> and "Transfer-encoding": "chunked" `headers` exist together.
        /* // ? fix ? of remote response ? //
        if (headers['transfer-encoding'] === 'chunked') {
            delete headers['content-length'];
        }
        request({url: url, headers: headers}, callback);
        */
        //app[web.1]: Error: Parse Error
        //app[web.1]:     at Error (native)
        //app[web.1]:     at TLSSocket.socketOnData (_http_client.js:309:20)
        //app[web.1]:     at emitOne (events.js:77:13)
        //app[web.1]:     at TLSSocket.emit (events.js:169:7)
        //app[web.1]:     at readableAddChunk (_stream_readable.js:153:18)
        //app[web.1]:     at TLSSocket.Readable.push (_stream_readable.js:111:10)
        //app[web.1]:     at TLSWrap.onread (net.js:531:20)

        // DONE recreate & fix locally
        // works as expected locally, so it must be ? heroku settings ?
        // ? get from behind heroku proxies ?
        // also:
        //{"error":"E11000 duplicate key error index: heroku_4mwk4dd8.links.$original_url_text_short_url_text dup key: { : \"articl\", : 0.5625 }","message":"on links.insertOne({'short_url':I, 'original_url':http://devcenter.heroku.com/articles/getting-started-with-nodejs}) catch error when query.allow = false"}
        // DONE so, original_url_text_short_url_text <- text index must be dropped
        // and 'http' cause no "Parse Error" error only 'https' does
        // even redirection works with http'https_link'?allow=true

        //***************//
        //*** routing ***//
        //***************//
        if (
          url_Obj.path == end_Points_List[0] ) {
            /*
            browser cache may prevent proper routing
            if it decides that page content is not changing
            ? use E-Tag ?
            */
            console.log("request.on(\"end\") path:", url_Obj.path, "route:", end_Points_List[0]);
            //response_Body = "Try route `/api/whoami`";            
            response_Body = index_Template_Content_Str;
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
          url_Obj.path.length > "/new/".length ) {
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

          if (is_Debug_Mode) {console.log(
            "request.on(\"end\" source_Link:", source_Link);}
          if (
            //source_Link.length > 0
            true ) {
            if (is_Debug_Mode) {console.log(
              "request.on \"end\" something after \"/new/\" in:", url_Obj.path);}
            url_Obj = url.parse(source_Link, true);
            //console.log(`url_Obj.pathname: ${url_Obj.pathname}`);
            // ? redundant ?
            //query_Allow_Prop = url_Obj.query.allow;
            if (is_Debug_Mode) {console.log(
              "request.on(\"end\") \"source_Link\" url_Obj\n:", JSON.stringify(url_Obj, null, '\t'));}
            // `allow`
            if (
              //url_Obj.query.allow
              //url_Obj.search != "" && url_Obj.query != {}
              query_Allow_Prop ) {
              // ? replace `search` with "" ?
              // skip `search` & all after `search`
              source_Link = source_Link.slice(0, source_Link.indexOf("?"));
              original_Link = source_Link;

              if (is_Debug_Mode) {console.log(
                "query_Allow_Prop:", query_Allow_Prop,
                ",so source_Link:", source_Link, "considered to be correct");}

              /*
              1. check MongoDB if `source_Link` exist already
                1.1 if true -> return stored `short_Link`
                1.2 else -> return `collection_Size`
                  1.2.1 generate `short_Link`
                  1.2.2 store pair / tuple {`source_Link`, `short_Link`}
                  1.2.3 return generated & stored `short_Link`
              */
              // for correct .env use `heroku local`
              var connection = mongo.connect(mongoLab_URI);

              connection
                .then((db) => {
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
                    collection
                      .count({})
                      .then((count) => {
                        var search_Result_Promise;

                        collection_Size = count;
                        short_Link_Size = short_Link_Gen.get_Short_Link_Length();
                        //db.close;

                        if (is_Debug_Mode) {console.log(
                          //`trying to find original_url == ${source_Link} in ${collection_Name}`);
                          "trying to find \'original_url\' ==", source_Link,
                          "doc in/among(st)", count, collection_Name,
                          "`s documents");}
                        assert(source_Link != "");
                        assert(source_Link.length > 0);
                        assert(original_Link == source_Link);

                        search_Result_Promise = db_Helpers
                          .find_Short_Link(
                            mongo//: MongoClient obj <- explicit
                            ,mongoLab_URI//: str
                            ,connection//: MongoClient.connect obj <- optional
                            ,db//: MongoClient.connect.then() obj <- optional
                            ,collection//: db.collection obj <- optional
                            ,collection_Name//: str
                            ,original_Link//: str
                            ,short_Link_Size//: int
                            ,is_Debug_Mode//,env.DEBUG_MODE.value
                        );
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
                        search_Result_Promise
                          .then((search_Result) => {
                            if (is_Debug_Mode) {console.log(
                              //`query on ${collection_Name} content: ${doc}`);
                              "search_Result on", collection_Name,
                              "is:", search_Result.document, "is_New:", search_Result.is_New);}
                            //console.log(`collection ${collection_Name} content.length: ${docs.length}`);
                            //console.log("collection_Name content:\n%j", docs);

                            // cases:
                            // {"document": result, "is_New": true}
                            // - found existed short link
                            // - generated new short link
                            // - undefined -> something goes wrong

                            if (
                              search_Result.document &&
                              !(search_Result.is_New) ) {
                              // found
                              // DONE have some problem with send response back to user
                              //search_Result.db.close;
                              db.close;

                              json_Response_Obj = {
                                //[TypeError: Cannot read property 'original_url' of undefined]
                                "original_url": (
                                  // source_Link
                                  search_Result.document.original_url
                                  //docs[0].original_url
                                ),
                                "short_url": search_Result.document.short_url,
                                "message": "previously stored link retrieved"
                              };
                              response_Helpers.
                                send_JSON_Response(
                                  // obj -> writable stream
                                  response,
                                  json_Response_Obj,
                                  // context
                                  'request.on "end" query.allow link found'
                              );
                            } else if (
                              search_Result.document &&
                              search_Result.is_New ) {
                              // has no previously stored `link`
                              // not found => new
                              // must be unique within `link` collection
                              // otherwise generate error on insert

                              // so, check for duplicate first / query mogoDB ?
                              // or insert new(ly) generated link every time
                              // until success ?

                              // -> just bulk_Insert (3 + 1) new links
                              // with high probability one of them will be unique
                              // .then() -> problem is which one ?

                              // in that case -> maybe check / find (3 + 1) new links
                              // in collection first
                              // .then() -> .insertOne() one / first of them that does not found ?

                              //if (db && typeof(db) == "object") {
                              //  if (db.hasOwnProperty('close')) {
                              //    db.close();
                              //  }
                              //}
                              short_Link = search_Result.document.short_url;
                              if (is_Debug_Mode) {console.log(
                                'about to store new short_Link in db', short_Link);}
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
                                // to show ful URL
                                "short_url": (request.socket.encrypted ? 'https://' : 'http://') +
                                request.headers.host + "/" +
                                // may create duplicates
                                // additional check needed
                                short_Link,
                                "message": "new link stored"
                              };
                              /*
                              document_Obj = {
                                "original_url": json_Response_Obj.original_url,
                                // save only necessary data
                                "short_url": short_Link
                              };
                              */
                              document_Obj = search_Result.document;
                              // must db.close inside
                              db_Helpers
                                // DONE check & test it
                                // DONE refactor if needed / necessary
                                .insert_Link_To_DB(
                                  db
                                  ,collection
                                  ,document_Obj// dict
                                  //response,// HTTP(S) obj
                                  //json_Response_Obj,
                                  //context_Message
                                  //"res.on 'end' query.allow insertOne"
                                ).then((insert_Ok) => {
                                    // guard
                                    if (insert_Ok) {
                                      response_Helpers
                                        .send_JSON_Response(
                                          // obj -> writable stream
                                          response
                                          ,json_Response_Obj
                                          // context
                                          //context_Message
                                          //"res.on 'end' query.allow insertOne"
                                      );
                                    }
                                  }
                                ).catch((err) => {
                                  if (is_Debug_Mode) {console.log(
                                    'insert_Link_To_DB.then() error:', err.message);}
                                  json_Response_Obj = {
                                    "error": err.message,
                                    "message": "on links.insertOne({'short_url':" +
                                      document_Obj.short_url + //short_Link +
                                      ", 'original_url':" + document_Obj.original_url +
                                      "}) catch error when query.allow"
                                  };

                                  response_Helpers.
                                    send_JSON_Response(
                                      // obj -> writable stream
                                      response,
                                      json_Response_Obj,
                                      // context
                                      'request.on "end" query.allow insert_Link_To_DB.then() catch error'
                                  );
                                  // guard
                                  if (db && typeof(db) == "object") {
                                    if (db.hasOwnProperty('close')) {
                                      db.close();
                                    }
                                  }
                                }
                              );
                            } else {
                              if (is_Debug_Mode) {console.log(
                                  "something wrong with search_Result:", search_Result);}
                              json_Response_Obj = {
                                "error": "something wrong with search_Result: " + search_Result,
                                "message": "when searching for " +
                                  original_Link +
                                  " in db." + collection_Name
                              };

                              response_Helpers.
                                send_JSON_Response(
                                  // obj -> writable stream
                                  response,
                                  json_Response_Obj,
                                  // context
                                  'request.on "end" query.allow search_Result_Promise unexpected error'
                              );
                              // guard
                              if (db && typeof(db) == "object") {
                                if (db.hasOwnProperty('close')) {
                                  db.close();
                                }
                              }
                            }
                            // finally
                            //db.close;
                          }
                        )
                        .catch((err) => {
                            //(collection / cursor).find error: TypeError: Cannot read property 'then' of undefined
                            if (is_Debug_Mode) {console.log(
                              'search_Result_Promise.then() error:', err.stack);}
                            json_Response_Obj = {
                              "error": err.message,
                              "message": short_Link + " search_Result_Promise.then() catch error when query.allow"
                            };
                            response_Helpers
                              .send_JSON_Response(
                                // obj -> writable stream
                                response,
                                json_Response_Obj,
                                // context
                                'request.on "end" query.allow search_Result_Promise.then() catch error'
                            );
                            // guard
                            if (db && typeof(db) == "object") {
                              if (db.hasOwnProperty('close')) {
                                db.close();
                              }
                            }
                          }
                        );
                      }
                    )
                    .catch((err) => {
                        if (is_Debug_Mode) {console.log(
                          'collection.count().then() error:', err.stack);}
                        json_Response_Obj = {
                          "error": err.message,
                          "message": "collection.count().then() catch error when query.allow"
                        };
                        response_Helpers
                          .send_JSON_Response(
                            // obj -> writable stream
                            response
                            ,json_Response_Obj
                            // context
                            ,'request.on "end" query.allow collection.count().then() catch error'
                        );
                        // guard
                        if (db && typeof(db) == "object") {
                          if (db.hasOwnProperty('close')) {
                            db.close();
                          }
                        }
                      }
                    );
                  }
                )
                .catch((err) => {
                  if (is_Debug_Mode) {console.log(
                    'mongo.db.connect error:', err.message, ";when query.allow");}
                  json_Response_Obj = {
                    "error": err.message,
                    "message": "mongo.db.connect().then() catch error when query.allow"
                  };
                  response_Helpers
                    .send_JSON_Response(
                      // obj -> writable stream
                      response
                      ,json_Response_Obj
                      // context
                      ,'request.on "end" query.allow mongo.db.connect() catch error'
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
              if (is_Debug_Mode) {console.log("Checking url_Obj.protocol:", url_Obj.protocol, "...");}
              if (
                url_Obj.protocol == "http:" || 
                url_Obj.protocol == "https:" ) {

                if (is_Debug_Mode) {console.log("Checking url_Obj.host:", url_Obj.host, "...");}
                if (
                  // hyphens '-' must be OK within (not leading / trailing), but underscores '_' not
                  ///^([^\W\s]+)((\.)([^\W\s]+))*((\.)([^\W\s]+))$/g.test(url_Obj.host)
                  host_Name_Validator.is_Host_Name_Valid(url_Obj.host) ) {

                  if (is_Debug_Mode) {console.log("Checking link:", source_Link, "in www");}
                  //Error: Protocol "https:" not supported. Expected "http:"
                  // receive 400 Bad Request	 => The request cannot be fulfilled due to bad syntax
                  // on some URL like: https://soundcloud.com/you/collection
                  var options = {
                    hostname: 'encrypted.google.com',
                    port: 443,// <- default
                    path: '/',
                    method: 'GET'
                  };
                  // for
                  // https.request(options, (res) => {});
                  //http
                  //getter = url_Obj.protocol == "http:" ? http : https;

                  //guard
                  if (url_Obj.protocol == "http:") {
                    getter = http;
                    // http.globalAgent.protocol == 'http:'
                  } else {
                    getter = https;
                    // https.globalAgent.protocol == 'https:'
                    //guard
                    if ("/new/" == source_Link.slice(0, 5)) {
                      source_Link = source_Link.slice(5);
                    }
                  }

                  getter
                    .get(
                      // extracted link (if any) goes here
                      //'http://www.google.com/index.html',
                      //TODO somehow having "/new/" prefix before "https" url
                      source_Link,
                      (res) => {
                        // 302 Found	The requested page has moved temporarily to a new URL   
                        if (is_Debug_Mode) {
                          console.log(
                            "Got response from " + getter.globalAgent.protocol + " GET request:",
                            res.statusCode, res.statusMessage);}
                        /*
                        // to consume response body
                        // or use 'res.resume()';
                        res.on('data', (d) => {
                          // page content goes here
                          process.stdout.write(d);
                        });
                        */
                        //console.log('headers: ', res.headers);
                        /* async so parent process must await for result */
                        json_Response_Obj = {
                          "get_Response": res.statusCode + ": " + res.statusMessage
                          ,"source_Link": source_Link
                          ,"headers": res.headers
                        };  
                        if (is_Debug_Mode) {console.log(
                          "request.on(\"end\") " + getter.globalAgent.protocol + ".get json_Response_Obj:",
                          JSON.stringify(json_Response_Obj, null, '\t'));}

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
                          .on('error',
                            (err) => {
                              if (is_Debug_Mode) {console.log("GET", source_Link, "res(response) error:", err.stack);}
                              json_Response_Obj = {
                                "error": err.message
                                ,"message": source_Link + " " + getter.globalAgent.protocol +
                                  " GET res.on(\'error\') when query.allow = false"
                                ,"headers": res.headers
                              };
                              response_Helpers
                                .send_JSON_Response(
                                  // obj -> writable stream
                                  response
                                  ,json_Response_Obj
                                  // context
                                  ,"request.on(\"end\") " + getter.globalAgent.protocol + " GET res.on(\'error\')"
                              );
                            }
                        );

                        res
                          //.on(
                          .once('end',
                            () => {
                              if (is_Debug_Mode) {console.log(
                                "Checking MongoDB for stored source_Link:", source_Link);}
                              // TODO get to https://soundcloud.com/ still return 400 ? TLS/SSL ?
                              // DONE why is "/new/" prefix in path ? <- ? removed ?
                              //heroku[router]: at=info method=GET path="/new/https://soundcloud.com/"
                              //"headers":
                              //{"cache-control":"private, max-age=0",
                              //"content-type":"text/html","date":"Thu, 07 Apr 2016 10:02:22 GMT",
                              //"server":"am/2",
                              //"set-cookie":[
                              // "sc_anonymous_id=4...; path=/;
                              // expires=Sun, 05 Apr 2026 10:02:22 GMT;
                              // domain=.soundcloud.com"],
                              //"via":"sssr",
                              //"x-frame-options":"SAMEORIGIN",
                              //"content-length":"15089","connection":"close"}
                              if (res.statusCode < 400) {
                                // DONE refactor using get_Short_Link_Length(), find_Short_Link() & insert_Link_To_DB()
                                var connection = mongo.connect(mongoLab_URI);

                                original_Link = source_Link;
                                connection
                                  .then((db) => {
                                      "use strict";
                                      const collection = db.collection(collection_Name);

                                      collection
                                        .count({})
                                        .then((count) => {
                                          var search_Result_Promise;

                                          collection_Size = count;
                                          short_Link_Size = short_Link_Gen.get_Short_Link_Length();

                                          if (is_Debug_Mode) {console.log(
                                            //`trying to find original_url == ${source_Link} in ${collection_Name}`);
                                            "trying to find \'original_url\' ==", source_Link,
                                            "doc in/among(st)", count, collection_Name,
                                            "`s documents");}
                                          assert(source_Link != "");
                                          assert(source_Link.length > 0);
                                          assert(original_Link == source_Link);

                                          search_Result_Promise = db_Helpers
                                            .find_Short_Link(
                                              mongo//: MongoClient obj <- explicit
                                              ,mongoLab_URI//: str
                                              ,connection//: MongoClient.connect obj <- optional
                                              ,db//: MongoClient.connect.then() obj <- optional
                                              ,collection//: db.collection obj <- optional
                                              ,collection_Name//: str
                                              ,original_Link//: str
                                              ,short_Link_Size//: int
                                              ,is_Debug_Mode//,env.DEBUG_MODE.value
                                          );

                                          search_Result_Promise
                                            .then((search_Result) => {
                                              if (is_Debug_Mode) {console.log(
                                                "search_Result on", collection_Name,
                                                "is:", search_Result.document, "is_New:", search_Result.is_New);}

                                              if (
                                                search_Result.document &&
                                                !(search_Result.is_New) ) {
                                                // found

                                                //search_Result.db.close;
                                                db.close;

                                                json_Response_Obj = {
                                                  "original_url": (
                                                    search_Result.document.original_url
                                                  ),
                                                  "short_url": search_Result.document.short_url,
                                                  "message": "previously stored link retrieved"
                                                };
                                                response_Helpers
                                                  .send_JSON_Response(
                                                    // obj -> writable stream
                                                    response
                                                    ,json_Response_Obj
                                                    // context
                                                    ,'request.on "end" link found'
                                                );
                                              } else if (
                                                search_Result.document &&
                                                search_Result.is_New ) {

                                                short_Link = search_Result.document.short_url;

                                                if (is_Debug_Mode) {console.log(
                                                  'about to store new short_Link in db', short_Link);}
                                                json_Response_Obj = {
                                                  "original_url": (
                                                    source_Link
                                                  ),
                                                  // to show ful URL
                                                  "short_url": (request.socket.encrypted ? 'https://' : 'http://') +
                                                  request.headers.host + "/" +
                                                  short_Link,
                                                  "message": "new link stored"
                                                };
                                                document_Obj = search_Result.document;
                                                // must db.close inside
                                                db_Helpers
                                                  .insert_Link_To_DB(
                                                    db
                                                    ,collection
                                                    ,document_Obj// dict
                                                  ).then((insert_Ok) => {
                                                      // guard
                                                      if (insert_Ok) {
                                                        response_Helpers.
                                                          send_JSON_Response(
                                                            response
                                                            ,json_Response_Obj
                                                        );
                                                      }
                                                    }
                                                  ).catch((err) => {
                                                    if (is_Debug_Mode) {console.log(
                                                      'insert_Link_To_DB.then() error:', err.message);}
                                                    json_Response_Obj = {
                                                      "error": err.message,
                                                      "message": "on links.insertOne({'short_url':" +
                                                        document_Obj.short_url + //short_Link +
                                                        ", 'original_url':" + document_Obj.original_url +
                                                        "}) catch error when query.allow = false"
                                                    };

                                                    response_Helpers.
                                                      send_JSON_Response(
                                                        // obj -> writable stream
                                                        response,
                                                        json_Response_Obj,
                                                        // context
                                                        'request.on "end" insert_Link_To_DB.then() catch error'
                                                    );
                                                    // guard
                                                    if (db && typeof(db) == "object") {
                                                      if (db.hasOwnProperty('close')) {
                                                        db.close();
                                                      }
                                                    }
                                                  }
                                                );
                                              } else {
                                                if (is_Debug_Mode) {console.log(
                                                    "something wrong with search_Result:", search_Result);}
                                                json_Response_Obj = {
                                                  "error": "something wrong with search_Result: " + search_Result,
                                                  "message": "when searching for " +
                                                    original_Link +
                                                    " in db." + collection_Name
                                                };

                                                response_Helpers.
                                                  send_JSON_Response(
                                                    // obj -> writable stream
                                                    response,
                                                    json_Response_Obj,
                                                    // context
                                                    'request.on "end" search_Result_Promise unexpected error'
                                                );
                                                // guard
                                                if (db && typeof(db) == "object") {
                                                  if (db.hasOwnProperty('close')) {
                                                    db.close();
                                                  }
                                                }
                                              }
                                              // finally
                                              //db.close;
                                            }
                                          )
                                          .catch((err) => {
                                              if (is_Debug_Mode) {console.log(
                                                'search_Result_Promise.then() error:', err.stack);}
                                              json_Response_Obj = {
                                                "error": err.message,
                                                "message": short_Link +
                                                  " search_Result_Promise.then() catch error when query.allow = false"
                                              };
                                              response_Helpers
                                                .send_JSON_Response(
                                                  // obj -> writable stream
                                                  response
                                                  ,json_Response_Obj
                                                  // context
                                                  ,'request.on "end" search_Result_Promise.then() catch error'
                                              );
                                              // guard
                                              if (db && typeof(db) == "object") {
                                                if (db.hasOwnProperty('close')) {
                                                  db.close();
                                                }
                                              }
                                            }
                                          );
                                        }
                                      )
                                      .catch((err) => {
                                          if (is_Debug_Mode) {console.log(
                                            'collection.count().then() error:', err.stack);}
                                          json_Response_Obj = {
                                            "error": err.message,
                                            "message": "collection.count().then() catch error when query.allow = false"
                                          };
                                          response_Helpers
                                            .send_JSON_Response(
                                              // obj -> writable stream
                                              response,
                                              json_Response_Obj,
                                              // context
                                              'request.on "end" collection.count().then() catch error'
                                          );
                                          // guard
                                          if (db && typeof(db) == "object") {
                                            if (db.hasOwnProperty('close')) {
                                              db.close();
                                            }
                                          }
                                        }
                                      );
                                    }
                                  )
                                  .catch((err) => {
                                    if (is_Debug_Mode) {console.log(
                                      "mongo.db.connect error:", err.message, "; when query.allow");}
                                    json_Response_Obj = {
                                      "error": err.message,
                                      "message": "mongo.db.connect().then() catch error when query.allow = false"
                                    };
                                    response_Helpers
                                      .send_JSON_Response(
                                        // obj -> writable stream
                                        response
                                        ,json_Response_Obj
                                        // context
                                        ,'request.on "end" mongo.db.connect() catch error'
                                    );
                                  }
                                );

                              //writer
                              //  .end('Goodbye\n'); 
                            } else {
                              if (is_Debug_Mode) {console.log("source_Link:", source_Link, "GET fails");}
                              json_Response_Obj = {
                                "get_Response": res.statusCode + ": " + res.statusMessage
                                ,"source_Link": source_Link
                                ,"message": getter.globalAgent.protocol + "get response result"
                                ,"headers": res.headers
                              };
                              response_Helpers
                                .send_JSON_Response(
                                  // obj -> writable stream
                                  response
                                  ,json_Response_Obj
                                  // context
                                  ,"res.on(\"end\") " + getter.globalAgent.protocol + "get response result"
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
                      (err) => {
                        if (is_Debug_Mode) {console.log("GET error:", err.stack);}
                        json_Response_Obj = {
                          "error": err.code + ": " + err.message
                          ,"message": "request.on(\"end\") " + getter.globalAgent.protocol +
                            " GET " + source_Link + " error"
                        };
                        response_Helpers
                          .send_JSON_Response(
                            response
                            ,json_Response_Obj
                            // context
                            ,"request.on(\"end\") "  + getter.globalAgent.protocol + " GET " + source_Link + " error"
                        );
                      }
                  );
                } else {
                  json_Response_Obj = {
                    "error": "bad URL host: " + url_Obj.host + " in "
                    ,"source_Link": source_Link
                    ,"message": "URL syntax / format check"
                  };
                  response_Helpers
                    .send_JSON_Response(
                      // obj -> writable stream
                      response
                      ,json_Response_Obj
                      // context
                      ,'request.on "end" error'
                  );

                }
              } else {
                // false positive on https://api-url-shortener-microservice.herokuapp.com/newFGhj
                // reaction on `path` starting with 'new'
                // so it must be followed by '/'
                // in order to be not part of a short_Link
                json_Response_Obj = {
                  "error": "bad URL protocol: " + url_Obj.protocol + " in "
                  ,"source_Link": source_Link
                  ,"message": "URL syntax / format check"
                };
                response_Helpers
                  .send_JSON_Response(
                    // obj -> writable stream
                    response
                    ,json_Response_Obj
                    // context
                    ,"request.on(\"end\") bad URL protocol: " + url_Obj.protocol + " error"
                );
              }
            }
            
          } else {
            if (is_Debug_Mode) {console.log("request.on(\"end\") nothing after \"new\" in:", url_Obj.path);}
            json_Response_Obj = {
              "error": "Nothing after \"new\" found in URL."
              ,"message": "Link expected."
            };
            response_Helpers
              .send_JSON_Response(
                // obj -> writable stream
                response
                ,json_Response_Obj
                // context
                ,'request.on "end" error'
            );
          }
        } else {
          /* Redirection */ 
          /*
          cases:
          - /<short_Link> -> redirect to <original_link> | error
          - /<path>/[whatever] -> redirect to / | root
          */
          if (is_Debug_Mode) {console.log('request.on "end" not "root"');}
          if (is_Debug_Mode) {console.log('request.on "end" -> Redirection');}
          short_Link = url_Obj.path.slice(1);
          if (is_Debug_Mode) {console.log('Checking short_Link', short_Link, "format");}
          // "net/.html".indexOf("\/") != -1
          if (
            //url_Obj.path.indexOf("\/") == -1
            // /^[A-z]+$/g.exec("netHtml");
            /^[A-z]+$/g.test(short_Link)
          ) {
            // search for entry in db
            if (is_Debug_Mode) {console.log('request.on "end" "path" matches expected "short_Link" format');}
            if (is_Debug_Mode) {console.log('searching for original link in db ...');}
            
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
                    if (is_Debug_Mode) {console.log('mongo.connect error:', err);}
                    //throw err;
                    json_Response_Obj = {
                      "message": 'searching for original link in db ...',
                      "result": err.message
                    };
                    response_Helpers
                      .send_JSON_Response(
                        // obj -> writable stream
                        response
                        ,json_Response_Obj
                        // context
                        ,'Redirection mongo.connect'
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
                        if (is_Debug_Mode) {console.log("cursor.hasNext.then()");}
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
                          if (is_Debug_Mode) {console.log("cursor.next.then()");}
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
                            response_Helpers
                              .send_JSON_Response(
                                // obj -> writable stream
                                response
                                ,json_Response_Obj
                                // context
                                ,'Redirection cursor.next'
                            );
                          } else {

                            if (is_Debug_Mode) {console.log(
                              collection_Name, 'collection find({"short_url":', short_Link, "}) result: %j", doc);}
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
                              if (is_Debug_Mode) {
                                console.log(`cursor.next.then, is response.headersSent: ${response.headersSent}`);
                              }
                              if (is_Debug_Mode) {
                                console.log(`cursor.next.then, is response.finished: ${response.finished}`);}
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
                              if (is_Debug_Mode) {console.log("response.end()");}
                              if (is_Debug_Mode) {
                                console.log("Redirection to original_url:", doc.original_url, "...");}
                              // Close db
                              //db.close();
                            } else {
                              // not found
                              json_Response_Obj = {
                                "message": 'searching for original link in db ...',
                                "result": "short link \'" + short_Link + "\' -> not found"//false
                              };
                              response_Helpers
                                .send_JSON_Response(
                                  // obj -> writable stream
                                  response
                                  ,json_Response_Obj
                                  // context
                                  ,'Redirection cursor.next'
                              );
                              // Close db
                              //db.close();
                            }
                            // Close db
                            db.close();
                            if (is_Debug_Mode) {console.log(`Close db after search for original_url`);}
                          }
                        }
                      )
                      .catch(
                      (err) => {
                        //catch error on mongoDB cursor.next: original_url is not defined
                        //catch error on mongoDB cursor.next: cursor is exhausted
                        //catch error on mongoDB cursor.next: 
                        // Cannot read property 'hasOwnProperty' of null
                        if (is_Debug_Mode) {console.log("catch error on mongoDB cursor.next:", err.stack);}
                        json_Response_Obj = {
                          "message": 'searching for original link in db ...',
                          "error": err.message
                        };
                        response_Helpers
                        .send_JSON_Response(
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
                        if (is_Debug_Mode) {console.log("catch error on mongoDB cursor.hasNext():", err.stack);}
                        json_Response_Obj = {
                          "message": 'searching for original link in db ...',
                          "error": err.message
                        };
                        response_Helpers
                        .send_JSON_Response(
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
            if (is_Debug_Mode) {console.log('request.on "end" path not match expected "short_Link" format');}
            if (is_Debug_Mode) {
              console.log('request.on "end" Redirection to request.headers.host: ', request.headers.host);}
            if (is_Debug_Mode) {console.log(url_Obj.protocol + '://' + url_Obj.host);}
            
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
            if (is_Debug_Mode) {console.log('request.on "end", response.end(), Redirection to request.headers.host');}
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
          if (is_Debug_Mode) {console.error('something is piping into the writer');}
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
          if (is_Debug_Mode) {console.log('response.on "pipe" src json_Response_Obj: %j', json_Response_Obj);}
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
          if (is_Debug_Mode) {console.log('response.on "pipe" response.end()');}
          src.unpipe(response);
        }
    );
    //reader.pipe(writer);
    //reader.unpipe(writer);  
    response
      .on(
        'unpipe', 
        (src) => {
          if (is_Debug_Mode) {console.error('something has stopped piping into the writer');}
        }
    );
      
    response
      .on(
        'error', 
        (err) => {
          if (is_Debug_Mode) {console.log("response.on(\"error\")");}
          if (is_Debug_Mode) {console.error("err.code:", err.code, "e.message:", err.message);}
          json_Response_Obj = {
            "message": "response.on(\"error\") handler"
            ,"error": err.message
          };
          response_Helpers
            .send_JSON_Response(
              response
              ,json_Response_Obj
              ,"response.on(\"error\")"
          );
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
      if (is_Debug_Mode) {
        console.log("http_Server on \"connection\" socket:", socket.localAddress, ":", socket.localPort);}
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
      if (is_Debug_Mode) {console.log('http_Server on "clientError"');}
      if (is_Debug_Mode) {
        console.error(`exception.code: ${exception.code}, exception.message: ${exception.message}`);}
    }
);

http_Server
  .on(
    'error', 
    (err) => {
      if (true) {console.log("http_Server.on(\"error\")");}
      if (true) {console.error(`err.code: ${err.code}, err.message: ${err.message}`);}
    }
);
/*
https
  .on(
    'error',
    (err) => {
      if (true) {console.log("http_Server.on(\"error\")");}
      if (true) {console.error(`err.code: ${err.code}, err.message: ${err.message}`);}
    }
);
*/
// error.stack
// Returns a string
// describing the point in the code
// at which the Error was instantiated.
process
.on(
  'unhandledRejection',
  (reason, p) => {
    if (is_Debug_Mode) {console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);}
    // application specific logging, throwing an error, or other logic here
});
/*##########################################################################*/
//exports.assert = assert;
//exports.send_JSON_Response = send_JSON_Response;
// not work as expected -> starts entire application
//module.exports.generate_Unique_Short_Link = generate_Unique_Short_Link;
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
// provide both HTTP and HTTPS versions of 'app' with the same code base
//http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);
