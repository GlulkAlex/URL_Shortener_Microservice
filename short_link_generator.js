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
  //collection_Size,//: int
  short_Link_Size,//int default:1, calculated / depended from 'collection_Size'
  // using `get_Short_Link_Length`
  // explicit (not from global)
  options_List,//: list of chars
  //source_Link,//: str <- only in case of good hash function
  is_Debug_Mode//: bool
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
    short_Link_Size == undefined ||
    Number(short_Link_Size).toString() == "NaN" ||
    short_Link_Size <= 0
  ){
    short_Link_Size = 1;
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
    short_Link_Length = short_Link_Size;
  }    
  if (options_List == undefined){
    options_List = choose_Options.symbols_List;
    //console.log("is_Debug_Mode:", is_Debug_Mode);
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
    //current_Char = choose_Options.symbols_List[random_Integer(0, 25)];
    current_Char = options_List[random_Integer(0, 25)];
    // upper / lower case
    if (random_Boolean()){
      result += current_Char;//.toLowerCase();  
    } else {
      result += current_Char.toUpperCase(); 
    }  
  } 
      
      
  return result;    
}

//*** not working functions / methods ***///
// helper
function get_Unique_Short_Link(
  db,// mongoDB obj
  collection, // mongoDB obj
  callback// if not return Promise
  //source_Link// str <- optional
)/* => str ? must be promise */{
  // new Promise((resolve, reject) => {resolve(thisPromiseSuccessReturnValue);});
  "use strict";
  /*
  1. Get `cursor` of all `documents` in `collection` => collection_Size
    (may be it is "lazy" until iterated & not consumes resources)
  2. short_Link_Size = short_Link_Gen.get_Short_Link_Length(collection_Size)
  // $filter (aggregation)
  // filter(filter) => {Cursor}
  // Set the `cursor` `query`
  *3. filter `cursor` by 'short_Link_Size' <- optional
  4. filter `cursor` by 'short_Link' =>
    if found any get_Short_Link() & repeat 4.
    else => Done.
  */
  // must be determined at least once per request
  //var collection_Size = 0;
  //var all_Docs_Cursor = collection
  //  .find();
  var all_Docs_Cursor_List = collection
    //all_Docs_Cursor
    .find()
    .toArray();
  var cursor_Docs_Count = collection
    //all_Docs_Cursor
    .find()
    .count();
  //var short_Link = "";
  //var attempts_Counter = 0;
  //var is_Unique = false;
  //var same_Link_Size_Docs_Cursor;
  var same_Link_Size_Docs = [];
  //var item_Index;
  //var doc_Index;
  //var doc;

  return Promise
    .resolve(
  cursor_Docs_Count
    //.count()
    .then((count) => {
        console.log('(collection / cursor).count:', count);
        //collection_Size = count;

        //if (collection_Size > 0) {}
        //all_Docs_Cursor.rewind();
        //all_Docs_Cursor
          //.toArray()
        all_Docs_Cursor_List
          .then((docs) => {
              generate_Unique_Short_Link(
                //collection_Size, //int
                count,
                docs//list of obj
              );
            }
        )
        .catch((err) => {
            // (collection / cursor).toArray error: ReferenceError: doc_Index is not defined
            console.log('(collection / cursor).toArray error:', err.stack);
            //return short_Link;
          }
        );
      }
    )
    .catch((err) => {
        console.log('(collection / cursor).count error:', err.stack);
        //return short_Link;
      }
  )//;
  );
  // when this happened ?
  //return short_Link;// str
}

//*** not working functions / methods end ***///

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