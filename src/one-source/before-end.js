const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleEnd(_, isCurrent) {
    this._send(VALUE, this._fn(), isCurrent);
    this._send(END, null, isCurrent);
  }

};

exports.BeforeEndStream = createStream('beforeEnd', mixin);
exports.BeforeEndProperty = createProperty('beforeEnd', mixin);
