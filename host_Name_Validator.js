"use strict";
/*** Node.js modules ***/
const assert = require('assert');
/*
from https://en.wikipedia.org/wiki/Hostname
Restrictions on valid host names
  Hostnames are
  composed of series of `labels`
  concatenated with `dots`,
  as are all `domain` names.
  For example, "en.wikipedia.org" is a `hostname`.
  Each `label` must be
  between (1) and (63) characters long, and
  the entire `hostname`
  (including the `delimiting` `dots`
  but not a `trailing` `dot`)
  has a maximum of (253) ASCII characters.

  The Internet standards for `protocols` mandate
  that component `hostname` `labels` may
  contain only
    the ASCII letters 'a' through 'z' (in a case-insensitive manner),
    the digits '0' through '9', and
    the hyphen ('-').
  The original specification of `hostnames` in RFC 952, mandated
  that `labels` could
    not `start` with a `digit` or with a `hyphen`, and
    must not end with a `hyphen`.
  However,
  a subsequent specification (RFC 1123) `permitted`
  `hostname` `labels` to start with `digits`.
  No other
    `symbols`,
    `punctuation` characters, or
    `white space` are permitted.

  While a `hostname` may
    not contain other characters,
    such as the `underscore` character (_),
    other `DNS` names may contain the `underscore`.
  Systems such as `DomainKeys` and `service records` use
  the `underscore` as
  a means to assure
  that their special character is not confused with `hostnames`.
  For example,
  '_http._sctp.www.example.com' specifies
  a `service pointer` for an SCTP capable `webserver` host (www)
  in the `domain` 'example.com'.

  Note that
  some applications (e.g. Microsoft Internet Explorer)
  won't work correctly
  if any part of the hostname contains an `underscore` character.

  One common cause of
  non-compliance with this specification is that
  the rules are not applied consistently
  across the board
  when `domain` `names` are chosen and registered.
  The `hostname` en.wikipedia.org is
  composed of
    the `DNS` `labels` 'en'
    (`hostname` or `leaf` `domain`),
    'wikipedia' (second-level `domain`) and
    'org' (top-level `domain`).
  `Labels` such as '2600' and '3abc' may be used in `hostnames`, but
  '-hi-','_hi_' and '*hi*' are invalid.

  A `hostname` is considered to be
  a `fully qualified domain name` (FQDN)
  if all the `labels`
  up to and including
  the top-level `domain` name (TLD) are specified.
  The `hostname` 'en.wikipedia.org'
  terminates with the top-level `domain` 'org' and
  is thus
  `fully qualified`.

  Depending on the `operating system` `DNS` software implementation,
  an unqualified `hostname` such as
  'csail' or 'wikipedia' may be
  automatically combined with `default` `domain` names
  configured into the system,
  in order to determine
  the `fully qualified domain name`.
  As an example,
  a student at MIT may be able
  to send mail to "joe@csail" and
  have it automatically qualified
  by the mail system to be sent to 'joe@csail.mit.edu'.
*/
function validate_Host_Name(
  host_Name//:str
)/* => bool */{
  "use strict";

  var is_Valid = true;//false;
  var host_Name_Length = host_Name.length;
  // Punycode encoding
  // xn--bcher-kva.ch <- valid
  /*
  var url_Reg_Ex =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/img;
  */
  var reg_Ex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/g;
  /**/
  if (
    host_Name_Length > 0 &&
    host_Name_Length < 253
  ) {
    var labels = [];
    var labels_Index = 0;
    var label = "";
    var label_Length = 0;
    var char = "";
    var char_Index = 0;

    labels = host_Name.split(".");
    // throws "AssertionError:
    //assert(labels.length > 1);
    //assert.fail(labels.length, 1, undefined, '>');
    //assert.ok(true);  // OK
    if (labels.length > 1) {
      for (labels_Index in labels) {
        label = labels[labels_Index];
        label_Length = label.length;
        //assert(label_Length > 0);
        //assert(label_Length <= 63);
        if (
          label_Length > 0 &&
          label_Length <= 63
        ) {
          //[a-z] -> char.charCodeAt(0) >= 97 && <= 122
          //[A-Z] -> char.charCodeAt(0) >= 65 && <= 90
          //[0-9] -> char.charCodeAt(0) >= 48 && <= 57
          //'-' -> char.charCodeAt(0) == 45
          //assert(label.charCodeAt(0) != 45);
          //assert(label.charCodeAt(label_Length - 1) != 45);
          for (char_Index in label) {
            /*
            assert(
              (label.charCodeAt(char_Index) >= 97 && label.charCodeAt(char_Index) <= 122) ||
              (label.charCodeAt(char_Index) >= 65 && label.charCodeAt(char_Index) <= 90) ||
              (label.charCodeAt(char_Index) >= 48 && label.charCodeAt(char_Index) <= 57) ||
              (label.charCodeAt(char_Index) == 45)
            );
            */
            if (
              char_Index == 0 ||
              char_Index == label_Length - 1
            ) {
              if (
                label.charCodeAt(char_Index) == 45
              ) {
                is_Valid = false;

                //break;
                return is_Valid;
              }
              if (
                (label.charCodeAt(char_Index) >= 97 && label.charCodeAt(char_Index) <= 122) ||
                (label.charCodeAt(char_Index) >= 65 && label.charCodeAt(char_Index) <= 90) ||
                (label.charCodeAt(char_Index) >= 48 && label.charCodeAt(char_Index) <= 57) ||
                (label.charCodeAt(char_Index) == 45)
              ) {
              } else {
                is_Valid = false;

                //break;
                return is_Valid;
              }
            }
          }

          if (!(is_Valid)) {

            //break;
            return is_Valid;
          }
        } else {
          is_Valid = false;

          //break;
          return is_Valid;
        }
      }
    } else {
      is_Valid = false;

      return is_Valid;
    }

    //is_Valid = reg_Ex.test(host_Name);

  } else {
    is_Valid = false;
  }

  return is_Valid;
}

exports.is_Host_Name_Valid = validate_Host_Name;