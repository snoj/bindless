(function(root, factory) {
  var Backbone, _, $;
  /*if(typeof exports !== 'undefined') {
    //node!...might not work.
    Backbone = require('backbone');
    _ = require('underscore');
  } else if(typeof window !== 'undefined') {*/
  if (typeof window !== 'undefined') {
    //todo tests for backbone, _ and jquery
    Backbone = window.Backbone;
     _ = window._;
     $ = window.$;
  }

  factory(root, Backbone, _, $);
})(this, function(root, Backbone, _, $) {

  var bl = Backbone.Model.extend({
    initialize: function(attrs, opts) {
      Backbone.Model.prototype.initialize.call(this, attrs, opts);
      var self = this;

      opts || (opts = {});

      var o = _.clone(opts);
      self.root = o.root || $('body');
    }
    ,redraw: function(options) {
      var self = this;
      var opts = _.clone(options);
      
      //data-blcontext is the (last) bl instance that controls that node.
      $('*[data-bind]', self.root)
        .each(function(i, v) {
          var j = $(v);
          var context = j.data('blcontext') || self.attributes;
          extractnproc(self.attributes, context, j, j.data('bind'));
        });
    }
  });
  var extractnproc = function(root, context, domo, text) {
    if(typeof context.$root === 'undefined')
      Object.defineProperty(context, '$root', {value: root}); //self.attributes?

    //todo shorten this long line if possible
    var raw = (new Function('$context', '$domo', 'try { with($context) { var ro = { ' + text + ' }; $domo.data("blcontext", $context); return ro; } } catch (ex) { $domo.removeData("blcontext"); return ex; }'))(context, domo);
    //if raw instanceof Error it is bad code or non-existent object tree for this context.
    if(raw instanceof Error) return;

    _.each(raw, function(v, k) {
      if(bl.handlers[k])
        bl.handlers[k](domo, context, v);
    });

  };
  bl.handlers = {
    value: function(domo, context, arg) {
      domo.val(arg);
    }
  };
  
  root.bl = bl;
});