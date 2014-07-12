function withInterval(name, mixin) {

  function AnonymousProperty(wait, args) {
    Property.call(this);
    this._wait = wait;
    this._intervalId = null;
    var _this = this;
    this._bindedOnTick = function() {  _this._onTick()  }
    this._init(args);
  }

  inherit(AnonymousProperty, Property, {

    _name: name,

    _init: function(args) {},
    _free: function() {},

    _onTick: function() {},

    _onActivation: function() {
      this._intervalId = setInterval(this._bindedOnTick, this._wait);
    },
    _onDeactivation: function() {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },

    _clear: function() {
      Property.prototype._clear.call(this);
      this._bindedOnTick = null;
      this._free();
    }

  }, mixin);

  Kefir[name] = function(wait) {
    return new AnonymousProperty(wait, rest(arguments, 1, []));
  }
}
