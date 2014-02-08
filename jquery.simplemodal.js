(function($, undefined) {
  'use strict';

  var Plugin, defaults, namespace;

  // Default options and settings
  namespace ='simplemodal';
  defaults = {
    top: null,
    overlay: 0.5,
    closeButton: null,
    duration: 200,
    onOpen: function() {}
    onClose: function() {}
  };

  // PLUGIN --------------------------------------------------------------------
  //
  // Declare the plugin fuction, isolated in a sub-module pattern to prevent
  // leaks and preserve vars scope.
  //
  Plugin = (function() {

    // The Plugin object
    function Plugin(element, options) {
      // Store elements to access it later easily
      this.element = element;
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = namespace;

      // Fire the init method
      this.init();
    }

    Plugin.prototype.init = function() {
      this.$overlay = setOverlay.call(this);
      this.$el = setModal.call(this, el);
    };

    var setOverlay = function () {
      return $('<div/>', {'class': 'sm-overlay'})
      .css({
        position: 'fixed',
        zIndex: 100,
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        background: '#000'
      })
      .hide()
      .appendTo('body');
    };

    var setModal = function (el) {
      var $el = $('<div/>', {'class': 'sm-modal'})
      .css({
        position : 'fixed',
        zIndex: 101,
        top: '50%',
        left : '50%'
      })
      .hide()
      .appendTo('body');

      $('<div/>', {'class': 'sm-content'})
      .append($(el))
      .appendTo($el);

      if (this.options.closeButton) {
        $('<button/>', {'class': 'sm-close'})
        .on('click', $.proxy(this.close, this))
        .appendTo($el);
      }

      return $el;
    };

    Plugin.prototype.open = function() {
      this.$overlay
      .fadeIn(this.options.duration);

      this.$el
      .css({
        marginTop: this.$el.outerHeight() / -2 + 'px',
        marginLeft: this.$el.outerWidth() / -2 + 'px'
      })
      .fadeIn(this.options.duration, $.proxy(this.options.onOpen, this.element));
    };

    Plugin.prototype.close = function() {
      this.$overlay
      .fadeOut(this.options.duration);

      this.$el
      .fadeOut(this.options.duration, $.proxy(this.options.onClose, this.element));
    };

    // Expose the Plugin externaly
    return Plugin;

  })();

  // JQUERY --------------------------------------------------------------------
  //
  // Expose the plugin in the jQury prototype
  //
  $.fn[namespace] = function(options) {
    // Explode arguments tio use it when callbacking
    var args, _;
    _ = arguments[0];
    args = [].slice.call(arguments, 1);

    // Iterate over jQuery elements
    return this.each(function() {
      var plugin;

      // Get the plugin attached to the element
      plugin = $.data(this, "plugin_" + namespace);

      if(!plugin) {
        // Instanciate a new plugin and store it in the jQuery object
        $.data(this, "plugin_" + namespace, new Plugin(this, options));
      } else if(plugin[_] != null && $.type(plugin[_]) == 'function') {
        // If the plugin contains the called method, apply it
        return plugin[_].apply(plugin, args);
      }
    });
  };

})(jQuery);
