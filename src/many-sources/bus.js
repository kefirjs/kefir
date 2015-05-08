const {inherit} = require('../utils/objects');
const AbstractPool = require('./abstract-pool');



function Bus() {
  AbstractPool.call(this);
}

inherit(Bus, AbstractPool, {

  _name: 'bus',

  plug(obs) {
    this._add(obs);
    return this;
  },
  unplug(obs) {
    this._remove(obs);
    return this;
  },

  emit(x) {
    this._emitValue(x);
    return this;
  },
  error(x) {
    this._emitError(x);
    return this;
  },
  end() {
    this._emitEnd();
    return this;
  },
  emitEvent(event) {
    this._emit(event.type, event.value);
  }

});


module.exports = Bus;
