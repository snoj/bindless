var bli = new bl();
bli.set('meohmy', 1234)
bli.redraw();

var bli2 = new bl();
bli2.set('inception', {innard: "space"})
bli2.redraw();


var a = bl.observable({test: 1, c: {a:2}});

console.log(a());

var b = bl.observable({test: 1, c: {a:2}}, {recurse: true});

console.log(b());