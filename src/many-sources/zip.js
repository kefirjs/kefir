const Stream = require('../stream');
const {VALUE, ERROR, END} = require('../constants');
const {inherit} = require('../utils/objects');
const {map, cloneArray} = require('../utils/collections');
const {spread} = require('../utils/functions');
const {isArray} = require('../utils/types');
const never = require('../primary/never');



function Zip(sources, combinator) {
  Stream.call(this);

  this._buffers = map(sources, (source) => isArray(source) ? cloneArray(source) : []);
  this._sources = map(sources, (source) => isArray(source) ? never() : source);

  this._combinator = combinator ? spread(combinator, this._sources.length) : (x => x);
  this._aliveCount = 0;

  this._$handlers = [];
  for (let i = 0; i < this._sources.length; i++) {
    this._$handlers.push((event) => this._handleAny(i, event));
  }

  this._activating = false;
}


inherit(Zip, Stream, {

  _name: 'zip',

  _onActivation() {
    this._activating = true;

    // if all sources are arrays
    while (this._isFull()) {
      this._emit();
    }

    const length = this._sources.length;
    this._aliveCount = length;
    for (let i = 0; i < length && this._active; i++) {
      this._sources[i].onAny(this._$handlers[i]);
    }

    this._activating = false;
  },

  _onDeactivation() {
    for (let i = 0; i < this._sources.length; i++) {
      this._sources[i].offAny(this._$handlers[i]);
    }
  },

  _emit() {
    let values = new Array(this._buffers.length);
    for (let i = 0; i < this._buffers.length; i++) {
      values[i] = this._buffers[i].shift();
    }
    this._send(VALUE, this._combinator(values), this._activating);
  },

  _isFull() {
    for (let i = 0; i < this._buffers.length; i++) {
      if (this._buffers[i].length === 0) {
        return false;
      }
    }
    return true;
  },

  _handleAny(i, event) {
    if (event.type === VALUE) {
      this._buffers[i].push(event.value);
      if (this._isFull()) {
        this._emit();
      }
    }
    if (event.type === ERROR) {
      this._send(ERROR, event.value, this._activating);
    }
    if (event.type === END) {
      this._aliveCount--;
      if (this._aliveCount === 0) {
        this._send(END, null, this._activating);
      }
    }
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._sources = null;
    this._buffers = null;
    this._combinator = null;
    this._$handlers = null;
  }

});



module.exports = function zip(observables, combinator /* Function | falsey */) {
  return observables.length === 0 ? never() : new Zip(observables, combinator);
};
