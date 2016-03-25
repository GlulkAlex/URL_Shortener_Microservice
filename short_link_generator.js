//"use strict";
// const circle = require('./circle.js');
// require('./short_link_generator.js').short_Link_Generator;
//const
/* global */
var choose_Options = function() {
  "use strict";
  var symbols_List = [];
  // (122 + 1 - 97) * 2
  var choose_Options_Size = 52;
  var i;

  for (i = 97; i < 122 + 1; i++){
    symbols_List.push(String.fromCharCode(i))
  }

  return {
    "symbols_List": symbols_List,
    "choose_Options_Size": choose_Options_Size
  };
}();

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

function get_Short_Link_Length(
  collection_Size, // int
  choose_Options_Size // int
) /* => int */{
  return Math.ceil(
    Math.log(collection_Size) / Math.log(choose_Options_Size)
  );
}

function short_Link_Generator(
  collection_Size,// int
  source_Link,// str
  is_Debug_Mode// bool
)/* => str*/{
  "use strict";
      
  //var symbols_List = [];
  var short_Link_Length = 1;    
  // "a".charCodeAt(0) == 97
  // "z".charCodeAt(0) == 122    
  // String.fromCharCode(98) == "b"
  var i;
  var result = "";
  var current_Char; 
  //var choose_Options_Size = 52;
      
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
    /*
    from https://www.mathsisfun.com/combinatorics/combinations-permutations-calculator.html
    How many different Objects are there? (n): 52 == 26 upper + 26 lower
    How many Objects will you choose? (r): e.g. 2 
    Is the position of each Object important? true
    Is there an unlimited supply of each Object? true
    Permutations: pow(52, 2) = 2704
    Formula: pow(n, r)
    
    to change the base of a logarithm
    log_a(x) = log_b(x) / log_b(a)
    so
    log_10(x) = log_e(x) / log_e(10)
    or 
    log_a(x) = ln(x) / ln(a)
    */
    // Math.log(x)	Returns the natural logarithm (base E) of x
    short_Link_Length = get_Short_Link_Length(
      collection_Size, // int
      choose_Options.choose_Options_Size // int
    );
  }    
  if (is_Debug_Mode == undefined){
    is_Debug_Mode = process.argv[2] || false; 
    //console.log("is_Debug_Mode:", is_Debug_Mode);  
  }
  /*
  for (i = 97; i < 122 + 1; i++){
    symbols_List.push(String.fromCharCode(i))  
  }
  */
  if (is_Debug_Mode){
    console.log("symbols_List:", JSON.stringify(symbols_List));    
  }
  // Math.random() returns 
  // a random number between 0 (inclusive),  and 1 (exclusive)   
  for (i = 0; i < short_Link_Length; i++){
    // must be from (0) to (122-97) == (26) total length
    current_Char = choose_Options.symbols_List[random_Integer(0, 25)];
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
exports.get_Short_Link_Length = get_Short_Link_Length;
exports.choose_Options = choose_Options;
//exports.test = (s) => "testing " + s;
// module.exports overrides previous exports
//module.exports = (s) => "testing " + s;