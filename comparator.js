//**** Node.js modules ***//
// a core module
const assert = require('assert');
//*** Node.js modules end ***//

// difference(other, ...)
// set - other - ...
// Return a new set
// with elements in the set that are
// not in the others.
function lists_Difference(
  //source
  this_List//: list (of obj)
  ,other_List//: list (of obj)
  ,is_Debug_Mode//: bool
){//: => list | undefined
  "use strict";
  var difference = [];
  var this_Indx;
  var this_Elem;
  var other_Indx;
  var other_Elem;
  var match_Found = false;
  var is_In_Other = false;
  // considering
  // cases:
  // [] vs. [], empty vs. empty => [] | undefined
  // [] vs. [Some] => [] | undefined
  // [Some] vs. [] => [Some] | this_List
  // [Some] vs. [Some], this_List.length == other_List.length
  // [Some] vs. [Some], this_List.length != other_List.length
  // nested iterator ->
  // each element form this_List against
  // each element form other_List
  // early stop if every elem in this_List has match in other_List
  // (with some or all it's elements)
  for (this_Indx in this_List) {
    if (other_List.length > 0) {
      is_In_Other = false;
      this_Elem = this_List[this_Indx];
      for (other_Indx in other_List) {
        other_Elem = other_List[other_Indx];
        // must be compare objects content
        // assert.deepEqual({a:1,b:1}, {b:1,a:1});
        /*
        try {
          assert.deepEqual(this_Elem, other_Elem);
          is_In_Other = true;
          //break;
        } catch(err) {
          // 'AssertionError' expected
          // The properties
          // error.code and error.errno are
          // aliases of one another and
          // return the same value.
          //!(env.DEBUG_MODE.value) ||
          console.log(err.code, err.errno, err.message);
        }
        */
        if (
          //this_Elem == other_Elem
          //assert.deepEqual(this_Elem, other_Elem)
          (is_In_Other) ||
          (this_Elem.original_url == other_Elem.original_url &&
          this_Elem.short_url == other_Elem.short_url)
        ) {
          !(is_Debug_Mode) ||
            console.log(this_Elem, "==", other_Elem);
          is_In_Other = true;
          break;
        }
      }
      is_In_Other || difference.push(this_Elem);
    } else {
      break;
    }
  }


  return difference;
}


module.exports.lists_Difference = lists_Difference;