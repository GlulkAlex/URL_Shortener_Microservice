// helper
function send_JSON_Response(
  // obj -> writable stream
  response,
  json_Response_Obj,
  // context
  message//: str
  ,is_Debug_Mode//: bool <- optional
) {
  "use strict";

  message = message ? message : 'res.on "end"';
  !(is_Debug_Mode) || console.log(
    `from send_JSON_Response, is response.headersSent: ${response.headersSent}`);
  /*
  response.finished
  Boolean value that indicates
  whether the response has completed.
  Starts as 'false'.
  After 'response.end()' executes,
  the value will be true.
  */
  !(is_Debug_Mode) || console.log(
    `from send_JSON_Response, is response.finished: ${response.finished}`);
  if (response.finished) {
    !(is_Debug_Mode) || console.log(
      'response.end() occur already. Nothing will be written as / to response.');
  } else {
    !(is_Debug_Mode) || console.log(
      message, 'json_Response_Obj: %j', json_Response_Obj);
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
    !(is_Debug_Mode) || console.log(message, 'response.end()');
  }

  //return ;//null; //void //Unit
}

module.exports.send_JSON_Response = send_JSON_Response;