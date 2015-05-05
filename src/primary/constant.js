const {inherit} = require('../utils/objects');
const Property = require('../property');
const {VALUE, END} = require('../constants');


function P(x) {
  Property.call(this);
  this._send(VALUE, x);
  this._send(END);
}

inherit(P, Property, {
  _name: 'constant'
});

module.exports = function constant(x) {
  return new P(x);
};
