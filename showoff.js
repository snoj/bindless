var tests = {
  _: null
  ,one: true
  ,two: true
  ,three: true
};

var bli = new bl();
bli.on('change redraw', function() {
  $('#test1 .watch pre.one').text(JSON.stringify(bli, null, "  "));
});
bli.set('meohmy', 1234);

var bli2 = new bl();
bli2.on('change redraw', function() {
  $('#test1 .watch .lastfrom').text("bl change/redraw");
  $('#test1 .watch pre.two').text(JSON.stringify(bli2, null, "  "));
});
setInterval(function() {
  $('#test1 .watch .lastfrom').text("interval");
  $('#test1 .watch pre.two').text(JSON.stringify(bli2, null, "  "));
}, 5000);
bli2.set('inception', {innard: "space"})
bli2.redraw()

var bli3 = new bl();
bli3.on('change redraw', function() {
  $('#test1 .watch pre.three').text(JSON.stringify(bli3, null, "  "));
});
bli3.set('dilation', 12, {recurse: true})
bli3.set('dream', {dream: {dream: {dilation: 12*12*12*12}, dilation: 12*12*12}, dilation: 12*12}, {recurse: true});


(function() {
  if(!!!arguments[0]) return;

  var b = new bl();
  b.on('change redraw', function() {
    $('#test2 .watch pre').text(JSON.stringify(b, null, "  "));
  });

  b.set('testkeyup', "1337 is elite");
})(tests.two);

(function() {
  if(!!!arguments[0]) return;

  var b = new bl();
  b.on('change redraw', function() {
    $('#test3 .watch pre').text(JSON.stringify(b, null, "  "));
  });

  b.set('alist', [{name: "dude"}, {name: "man"}], {recurse: true});
})(tests.three);
