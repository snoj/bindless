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

var bli3 = new bl();
bli3.on('change redraw', function() {
  $('#test1 .watch pre.three').text(JSON.stringify(bli3, null, "  "));
});
bli3.set('dilation', 12, {recurse: true})
bli3.set('dream', {dream: {dream: {dilation: 12*12*12*12}, dilation: 12*12*12}, dilation: 12*12}, {recurse: true})
