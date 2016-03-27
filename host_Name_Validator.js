"use strict";
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
  var is_Valid = true;//false;
  // Punycode encoding
  // xn--bcher-kva.ch <- valid
  /*
  var url_Reg_Ex =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/img;
  */
  var reg_Ex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/g;
  /**/
  if (
    host_Name.length > 0 &&
    host_Name.length < 253
  ) {
    test(host_Name);
  } else {
    is_Valid = false;
  }

  return is_Valid;
}

exports.is_Host_Name_Valid = validate_Host_Name;