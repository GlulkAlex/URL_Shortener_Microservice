//const circle = require('./circle.js');
const short_Link = require('./short_link_generator.js');

/* unit test */
// OK
//console.log( `The area of a circle of radius 4 is ${circle.area(4)}`);

// OK
console.log( `short_Link test: ${short_Link.test("Hi!")}`);
// OK
console.log( `short_Link test: ${short_Link.get_Short_Link(16, 2, true)}`);
// OK
console.log( `short_Link rand_Bool: ${short_Link.rand_Bool()}`);
console.log( `short_Link rand_Bool: ${short_Link.rand_Bool()}`);
console.log( `short_Link rand_Bool: ${short_Link.rand_Bool()}`);
console.log( `short_Link rand_Bool_Gen: ${short_Link.rand_Bool_Gen.next().value}`);
console.log( `short_Link rand_Bool_Gen: ${short_Link.rand_Bool_Gen.next().value}`);
console.log( `short_Link rand_Bool_Gen: ${short_Link.rand_Bool_Gen.next().value}`);
// OK
//console.log( `short_Link test: ${short_Link("Hi!")}`);
