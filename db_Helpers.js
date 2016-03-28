// helper
function generate_Unique_Short_Link(
  collection_Size, //int <- may be evaluated / inferred from 'docs'
  docs,//list of obj
  callback// <- optional
) /* => thenable Promise => (str | error)*/{
  "use strict";

  var post_Condition = true;// executed at least once
  var is_Unique = true;
  var short_Link = "";
  var attempts_Counter = 0;
  var item_Index;
  var doc_Index;
  var doc;
  console.log('receive all docs in links.');

  while (
    post_Condition
  ) {
    // must be generated at least once
    short_Link = short_Link_Gen
      .get_Short_Link(
        // must be found first <- crucial / almost mandatory
        collection_Size
    );
    is_Unique = true;
    if (docs.length > 0) {
    }
    // order does not matter
    for (doc_Index in docs) {
      doc = docs[doc_Index];
      if (doc.short_url == short_Link) {
        // fail, duplicated value => generate new one
        is_Unique = false;

        break;
      }
    }
    attempts_Counter += 1;
  }
  post_Condition = !(is_Unique) && (collection_Size > attempts_Counter);
  // insert must be next
  console.log('Unique short_Link:', short_Link);
  // Promise.resolve(thenable);
  if (callback) {
    //typeof ()=>{} == 'function'
    return callback(short_Link);
  } else {
    return Promise
      .resolve(
        short_Link
        //{
        //  then: (onFulfill, onReject) => {
        //    onFulfill(short_Link);
        //  }
        //}
    );
  }
}

exports.make_Unique_Link = generate_Unique_Short_Link;