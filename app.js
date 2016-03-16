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
var index_Template_Content_List = [
  '<html>',
    '<head>',
      '<title>URL Shortener Microservice</title>',
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
          '</ul>',    
        '<h3>Example output:</h3>',        
          '<ul>',
            '<li>',
              '<code>{ "original_url": "http://freecodecamp.com/news", "short_url": "https://shurli.herokuapp.com/QqZ" }</code>', 
            '</li>',
          '</ul>',      
      '</section>',        
    '</body>',
  '</html>'
];
var index_Template_Content_Str = index_Template_Content_List.join("\n");
var response_Body; 
var source_Link = "";

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
    var source_Link = '';
    var json_Response_Obj = {}; 
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
    /* .on "data" must be enabled 
    it seems that it work in pair with .on "end" event */  
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
    /**/    
    request.on(
      'end', 
      () => {
        /*
        cases:
        - / | root -> instructions
        - /new<link>[options] -> short_Link | error
        - /<short_Link> -> redirect | error
        - /<path>/[whatever] -> redirect to / | root
        */
        console.log('request.on "end"');
        if (
          true
          //is_Debug_Mode
        ) {
          console.log(`request.on "end" request.url: ${request.url}`);
        }
        if (request.method == 'GET' ) {
        } 
        /*
        -e, --eval script     evaluate script
        -p, --print           evaluate script and print result
        */
        //node -pe "require('url').parse('/test?q=1', true)" 
        url_Obj = url.parse(request.url, true);
        //console.log(`url_Obj.pathname: ${url_Obj.pathname}`);
        query_List = [];
        for(var item in url_Obj.query){
          query_List.push(item);
          query_List.push(url_Obj.query[item]);
        } 
        console.log('request.on "end" query_List\n%j:', query_List);
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
        /*** routing ***/  
        if (
          url_Obj.pathname == end_Points_List[0]
        ) {
          
          console.log('request.on "end" root');  
          json_Response_Obj = {
            "ipaddress": 'client_IP',
            "language": 'accepted_Language',
            "software": 'get_Software( request )'
          };  
          response.writeHead(
            200, 
            { 'Content-Type': 'application/json' }
          ); 
          response
            .write(
              JSON
                .stringify(
                  //json_Response_Obj  
                  {
                    "hour": 25
                  }
              )
          );
        } else if (
          url_Obj.path == end_Points_List[1] ||
          url_Obj.pathname == end_Points_List[1]
        ) {    
            /*
            browser cache may prevent proper routing
            if it decides that page content is not changing
            ? use E-Tag ?
            */
            console.log('request.on "end" new:', end_Points_List[1]);
            response_Body = "Try route `/api/whoami`";            
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
        } else if (
          //"/new"
          url_Obj.path.slice(0, 4) == end_Points_List[1]
        ) {
          source_Link = url_Obj.path.slice(5);
          console.log('request.on "end" source_Link:', source_Link);
          if (source_Link.length > 0) {
            console.log('request.on "end" something after "new" in:', url_Obj.path);
            url_Obj = url.parse(source_Link, true);
            //console.log(`url_Obj.pathname: ${url_Obj.pathname}`);
            query_List = [];
            for(var item in url_Obj.query){
              query_List.push(item);
              query_List.push(url_Obj.query[item]);
            } 
            console.log('request.on "end" source_Link query_List\n%j:', query_List);
            console.log('request.on "end" source_Link url_Obj\n%j:', url_Obj);
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
                http
                  .get(
                    // extracted link (if any) goes here
                    //'http://www.google.com/index.html', 
                    source_Link,
                    (res) => {
                      // 302 Found	The requested page has moved temporarily to a new URL   
                      console.log(`Got response: ${res.statusCode}`);
                      /* async so parent process must await for result */
                      json_Response_Obj = {
                        "get_Response": res.statusCode,
                        "source_Link": source_Link
                      };  
                      console.log('request.on "end" http.get json_Response_Obj: %j', json_Response_Obj);
                      response.writeHead(
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
                      response.writeHead(
                        200, 
                        { 'Content-Type': 'application/json' }
                      ); 
                      response
                        .write(
                          JSON
                            .stringify(
                              json_Response_Obj  
                          )
                      );
                      response.end();
                      console.log('request.on "end" error response.end()');
                      
                    }
                );
              } else {
                json_Response_Obj = {
                  "error": "bad URL host"
                };
                response.writeHead(
                  200, 
                  { 'Content-Type': 'application/json' }
                ); 
                response
                  .write(
                    JSON
                      .stringify(
                        json_Response_Obj  
                    )
                );
                response.end();
                console.log('request.on "end" error response.end()');

              }
            } else {
              json_Response_Obj = {
                "error": "bad URL protocol"
              };
              
              response.writeHead(
                200, 
                { 'Content-Type': 'application/json' }
              ); 
              response
                .write(
                  JSON
                    .stringify(
                      json_Response_Obj  
                  )
              );
              response.end();
              console.log('request.on "end" error response.end()');
            }
            
          } else {
            console.log('request.on "end" nothing after "new" in:', url_Obj.path);
            json_Response_Obj = {
              "error": 'Nothing after "new" found in URL. Link expected.'
            };  
            response.writeHead(
              200, 
              { 'Content-Type': 'application/json' }
            ); 
            response
              .write(
                JSON
                  .stringify(
                    json_Response_Obj  
                )
            );
            response.end();
            console.log('request.on "end" error response.end()');
          }
        } else {
          /* Redirection */ 
          console.log('request.on "end" not "root"');    
          console.log('request.on "end" -> Redirection');  
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
            
          //response
          //  .redirect(url_Obj.protocol + '://' + url_Obj.host);  
          response.end();
          console.log('request.on "end" Redirection response.end()');
        }  
          
        /* close `writable` `stream` */
        //response.end();
        //console.log('request.on "end" response.end()');
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
