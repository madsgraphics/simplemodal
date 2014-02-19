(function($, undefined) {
  'use strict';

  var Plugin, defaults, namespace;

  // Default options and settings
  namespace ='simplemodal';
  defaults = {
    top: null,
    overlay: 0.5,
    closeButton: null,
    className: null,
    duration: 200,
    autoOpen: false,
    onOpen: function() {},
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
      this.$el = setModal.call(this);

      if (this.options.autoOpen) this.open();
    };

    var setOverlay = function () {
      var $el = $('<div/>', {'class': 'sm-overlay'})
      .css({
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        background: '#000'
      })
      .hide()
      .appendTo('body');

      $('<div/>', {'class': 'sm-loader'})
      .hide()
      .appendTo($el);

      return $el;
    };

    var setModal = function (el) {
      var $el,
          className = 'sm-modal' + (this.options.className? ' ' + this.options.className : '');

      $el = $('<div/>', {'class': className})
      .css({
        position : 'fixed',
        zIndex: 9999,
        top: this.options.top? this.options.top : '50%',
        left : '50%'
      })
      .hide()
      .appendTo('body');

      $('<div/>', {'class': 'sm-content'})
      .append( $(this.element) )
      .appendTo($el);

      if (this.options.closeButton) {
        $('<button/>', {'class': 'sm-close'})
        .append( $('<span/>', {'text': 'close'}) )
        .on('click', $.proxy(this.close, this))
        .appendTo($el);
      }

      return $el;
    };

    var toggleLoader = function () {
      this.$overlay.find('.sm-loader').toggle();
    };

    Plugin.prototype.open = function() {
      var close = $.proxy(this.close, this);

      this.$overlay
      .fadeTo(this.options.duration, this.options.overlay, $.proxy(toggleLoader, this));

      this.$el
      .css({
        marginTop: this.options.top? 0 : this.$el.outerHeight() / -2 + 'px',
        marginLeft: this.$el.outerWidth() / -2 + 'px'
      })
      .fadeIn(this.options.duration, $.proxy(this.options.onOpen, this.element));

      $(document).one('keyup', function (e) {
        if (e.which == 27) close();
      });
    };

    Plugin.prototype.close = function() {
      this.$overlay
      .fadeOut(this.options.duration, $.proxy(toggleLoader, this));

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
