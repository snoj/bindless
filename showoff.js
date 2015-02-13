var bli = new bl();
bli.on('change redraw', function() {
  $('#test1 .watch pre').text(JSON.stringify(bli, null, "  "));
});
bli.set('meohmy', 1234);

var bli2 = new bl();
bli2.set('inception', {innard: "space"})
bli2.redraw();

try {
  var a = bl.observable({test: 1, c: {a:2}});

  console.log(a());

  var b = bl.observable({test: 1, c: {a:2}}, {recurse: true});

  console.log(b());
} catch(ex) {}