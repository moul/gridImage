// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, console) {
    var Plugin, defaults, document, log, pluginName;
    pluginName = 'gridImage';
    document = window.document;
    log = function() {
      return console.log.apply(console, arguments);
    };
    defaults = {
      width: 30,
      height: 30,
      left: 10,
      top: 10,
      right: 10,
      bottom: 10,
      backgroundColor: 'rgba(255, 0, 0, 0.05)',
      gridColor: 'white',
      container: $('body'),
      updateOrigin: false,
      properties: ['-webkit-linear-gradient', '-moz-linear-gradient', '-o-linear-gradient', '-ms-linear-gradient', 'linear-gradient']
    };
    Plugin = (function() {

      function Plugin(options) {
        this.update = __bind(this.update, this);

        this.build = __bind(this.build, this);

        this.initGradients = __bind(this.initGradients, this);

        var _this = this;
        this.options = $.extend({}, defaults, options);
        if (this.options.container.is("img")) {
          this.options.container.load(function() {
            return _this.update();
          });
        } else {
          this.update();
        }
      }

      Plugin.prototype.initGradients = function() {
        this.gradients = [];
        this.gradients.push("top,  transparent " + (this.options.height - 1) + "px, " + this.options.gridColor + " " + this.options.height + "px");
        return this.gradients.push("left, transparent " + (this.options.width - 1) + "px, " + this.options.gridColor + " " + this.options.width + "px");
      };

      Plugin.prototype.build = function() {
        this.width = this.options.container.width();
        this.height = this.options.container.height();
        if (this.options.updateOrigin) {
          this.imgSrc = this.options.container.attr('src');
          this.grid = $('<div></div>').css({
            width: this.width,
            height: this.height,
            backgroundImage: "url(" + this.imgSrc + ")"
          });
          return this.options.container.replaceWith(this.grid);
        } else {
          this.grid = $('<div></div>');
          this.grid.css('position', 'absolute');
          return this.options.container.after(this.grid);
        }
      };

      Plugin.prototype.update = function() {
        var compiledGradient, containerPosition, gradient, property, _i, _len, _ref, _results;
        if (!this.grid) {
          this.build();
        }
        if (!this.options.updateOrigin) {
          containerPosition = this.options.container.position();
          this.grid.css({
            top: containerPosition.top + parseInt(this.options.top),
            left: containerPosition.left + parseInt(this.options.left),
            width: this.width - parseInt(this.options.left) - parseInt(this.options.right),
            height: this.height - parseInt(this.options.top) - parseInt(this.options.bottom),
            backgroundColor: this.options.backgroundColor
          });
        }
        this.grid.css({
          backgroundSize: "" + this.options.width + "px " + this.options.height + "px"
        });
        this.initGradients();
        _ref = this.options.properties;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          compiledGradient = ((function() {
            var _j, _len1, _ref1, _results1;
            _ref1 = this.gradients;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              gradient = _ref1[_j];
              _results1.push("" + property + "(" + gradient + ")");
            }
            return _results1;
          }).call(this)).join(', ');
          _results.push(this.grid.css('background-image', compiledGradient));
        }
        return _results;
      };

      return Plugin;

    })();
    $.fn[pluginName] = function(options) {
      if (options === 'getObject') {
        return this.data("plugin_" + pluginName);
      }
      return this.each(function() {
        var newPlugin;
        if (!$.data(this, "plugin_" + pluginName)) {
          options = {
            container: $(this)
          };
          newPlugin = new Plugin(options);
          $.data(this, "plugin_" + pluginName, newPlugin);
        }
        return $.data(this, "plugin_" + pluginName);
      });
    };
    return $(document).ready(function() {
      return $('[rel="#{pluginName}"]').each(function() {
        var options;
        options = {
          container: $(this)
        };
        return $.fn[pluginName].call(options);
      });
    });
  })(jQuery, window, console);

}).call(this);
