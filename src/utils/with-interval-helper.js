import Kefir from '../kefir';
import {inherit} from './objects';
import {Stream} from '../core';
import {rest} from './collections';


export default function withInterval(name, mixin) {

  function AnonymousStream(wait, args) {
    Stream.call(this);
    this._wait = wait;
    this._intervalId = null;
    var $ = this;
    this._$onTick = function() {
      $._onTick();
    };
    this._init(args);
  }

  inherit(AnonymousStream, Stream, {

    _name: name,

    _init: function(args) {},
    _free: function() {},

    _onTick: function() {},

    _onActivation: function() {
      this._intervalId = setInterval(this._$onTick, this._wait);
    },
    _onDeactivation: function() {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },

    _clear: function() {
      Stream.prototype._clear.call(this);
      this._$onTick = null;
      this._free();
    }

  }, mixin);

  Kefir[name] = function(wait) {
    return new AnonymousStream(wait, rest(arguments, 1, []));
  };
}
