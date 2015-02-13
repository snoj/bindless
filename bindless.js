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
      self.on('redraw', self.redraw);
      self.blroot = bl.observable({});
      self.blroot.on('mutated change', function() {
        self.trigger('redraw');
      })
    }
    ,set: function(key, val, options) {
      var self = this;
      var attrs;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      _.each(attrs, function(v, k) {
        if (!!self.attributes[k] && !!!v.__bl_proto__) {
          self.attributes[k](v);
          delete attrs[k];
        }
        else if(!!!v.__bl_proto__) {
          attrs[k] = bl.observable(v, {recurse: options.recurse}, self.blroot);
          attrs[k].on('mutated change', function() { self.trigger('redraw'); });
        } else if (!!v.__bl_proto__) {
          v.parent = self.blroot;
          attrs[k] = v;
          attrs[k].on('mutated change', function() { self.trigger('redraw'); });
        }
      });

      var r = Backbone.Model.prototype.set.call(this, attrs, options);
      self.redraw();
      return r;
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
  bl.observableProperties = {
    __bl_proto__: true
  };
  bl.observable = function(value, options, parent) {
    options || (options = {});

    var _oldvalue = value;
    var ratelimit = options.ratelimit || 1;
    var ratecounter = 0;

    var ob = function(newValue, ioptions) {
      ioptions || (ioptions = {})
      var self = arguments.callee;
      if(arguments.length == 0)
        return _oldvalue;
      
      if(arguments.length == 1) {
        if(!_.isEqual(_oldvalue, newValue)) {

          self.trigger('prechange', newValue, _oldvalue, ob);

          if(!!!(ratecounter % ratelimit)) {
            ratecounter = 1;
            if(!!!ioptions.silent) {
              self.trigger('change', newValue, _oldvalue, ob);
              if(self.parent) self.parent.trigger('mutated', ob, newValue, _oldvalue);
            }
          } else {
            ratecounter++;
          }
          _oldvalue = newValue;
        }
        //return self;
      }
    };
    _.extend(ob, _.clone(bl.observableProperties));
    _.extend(ob, {
      options: options
      ,parent: parent
      ,toJSON: function() { return _oldvalue; }
      //,toString: function() { return _oldvalue; }
    });
    _.extend(ob, Backbone.Events);
    ob.on('mutated', function(originator, newValue, _oldvalue) {
      //redraw
      //notify parents
      if (ob.parent) ob.parent.trigger('mutated', originator, newValue, _oldvalue);
    });

    if(options.recurse) {
      _.each(value, function(v, k) {
        value[k] = bl.observable(value[k], options, ob);
      });
    }

    return ob;
  }

  var extractnproc = function(root, context, domo, text) {
    if(typeof context.$root === 'undefined')
      Object.defineProperty(context, '$root', {value: root}); //self.attributes?

    //todo shorten this long line if possible
    var raw = (new Function('$context', '$domo', 'try { with($context) { var ro = { ' + text + ' }; $domo.data("blcontext", $context); return ro; } } catch (ex) { $domo.removeData("blcontext"); console.error(ex); return ex; }'))(context, domo);
    //if raw instanceof Error it is bad code or non-existent object tree for this context.
    if(raw instanceof Error) return;

    _.each(raw, function(v, k) {
      if(bl.handlers[k])
        bl.handlers[k](domo, context, v);
    });

  };
  bl.handlers = {
    value: function(domo, context, arg) {
      var v = (typeof arg === 'function') ? arg() : arg;
      domo.val(v);
      if (!!!domo.data('blevent-value') && !!arg.__bl_proto__) {
        var changeHandler = function(e) {
          arg(domo.val());
        };
        domo.data('blevent-value', changeHandler);
        domo.on('change', changeHandler);
      }
    }
    ,text: function(domo, context, arg) {
      domo.text(arg);
    }
    ,html: function(domo, context, arg) {
      domo.html(arg);
    }
  };
  
  root.bl = bl;
});