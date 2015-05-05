const {inherit} = require('../utils/objects');
const Stream = require('../stream');
const {END} = require('../constants');



function S(generator) {
  Stream.call(this);
  this._generator = generator;
  this._source = null;
  this._inLoop = false;
  this._activating = false;
  this._iteration = 0;
  this._$handleAny = (event) => this._handleAny(event);
}

inherit(S, Stream, {

  _name: 'repeat',

  _handleAny(event) {
    if (event.type === END) {
      this._source = null;
      this._getSource();
    } else {
      this._send(event.type, event.value, this._activating);
    }
  },

  _getSource() {
    if (!this._inLoop) {
      this._inLoop = true;
      while (this._source === null && this._alive && this._active) {
        this._source = this._generator(this._iteration++);
        if (this._source) {
          this._source.onAny(this._$handleAny);
        } else {
          this._send(END);
        }
      }
      this._inLoop = false;
    }
  },

  _onActivation() {
    this._activating = true;
    if (this._source) {
      this._source.onAny(this._$handleAny);
    } else {
      this._getSource();
    }
    this._activating = false;
  },

  _onDeactivation() {
    if (this._source) {
      this._source.offAny(this._$handleAny);
    }
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._generator = null;
    this._source = null;
    this._$handleAny = null;
  }

});


module.exports = function(generator) {
  return new S(generator);
}
