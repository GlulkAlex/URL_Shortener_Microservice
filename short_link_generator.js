// const circle = require('./circle.js');
// require('./short_link_generator.js').short_Link_Generator;
function* random_Boolean_Gen(){
  while(true){  
      yield Math.random() >= 0.5;
  }
}

function random_Boolean(){
  "use strict";  
  return Math.random() >= 0.5;
}

function random_Integer(
  // inclusive
  lower_Bound, 
  // inclusive
  upper_Bound
) {
  return Math.floor(
    Math.random() * (upper_Bound - lower_Bound + 1) + lower_Bound
  );
}

function short_Link_Generator(
  collection_Size,
  source_Link,
  is_Debug_Mode 
){
  "use strict";
      
  var symbols_List = [];
  var short_Link_Length = 1;    
  // "a".charCodeAt(0) == 97
  // "z".charCodeAt(0) == 122    
  // String.fromCharCode(98) == "b"
  var i;
  var result = "";
  var current_Char;    
      
  // preprocessing / initializing
  if (
    collection_Size == undefined ||
    Number(collection_Size).toString() == "NaN" ||
    collection_Size <= 0  
  ){
    collection_Size = 1;  
  } else {
    // Number("s").toString() == "NaN" 
    // ceil(x)	Returns x, rounded upwards to the nearest integer  
    short_Link_Length = Math.ceil(Math.sqrt(collection_Size));  
  }    
  if (is_Debug_Mode == undefined){
    is_Debug_Mode = process.argv[2] || false; 
    //console.log("is_Debug_Mode:", is_Debug_Mode);  
  }    
  for (i = 97; i < 122 + 1; i++){
    symbols_List.push(String.fromCharCode(i))  
  } 
  if (is_Debug_Mode){
    console.log("symbols_List:", JSON.stringify(symbols_List));    
  }
  // Math.random() returns 
  // a random number between 0 (inclusive),  and 1 (exclusive)   
  for (i = 0; i < short_Link_Length; i++){
    // must be from (0) to (122-97) == (26) total length
    current_Char = symbols_List[random_Integer(0, 25)];  
    // upper / lower case  
    if (random_Boolean()){
      result += current_Char;//.toLowerCase();  
    } else {
      result += current_Char.toUpperCase(); 
    }  
  } 
      
      
  return result;    
}

// assigning to exports will not modify module, must use module.exports
exports.get_Short_Link = short_Link_Generator;
exports.rand_Bool = random_Boolean;
exports.rand_Bool_Gen = random_Boolean_Gen(); 
exports.rand_Int = random_Integer;
//exports.test = (s) => "testing " + s;
// module.exports overrides previous exports
//module.exports = (s) => "testing " + s;