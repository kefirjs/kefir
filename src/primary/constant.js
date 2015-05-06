const {inherit} = require('../utils/objects');
const Property = require('../property');


function P(x) {
  Property.call(this);
  this._emitValue(x);
  this._emitEnd();
}

inherit(P, Property, {
  _name: 'constant'
});

module.exports = function constant(x) {
  return new P(x);
};
