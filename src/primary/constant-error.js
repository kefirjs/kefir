const {inherit} = require('../utils/objects');
const Property = require('../property');


function P(x) {
  Property.call(this);
  this._emitError(x);
  this._emitEnd();
}

inherit(P, Property, {
  _name: 'constantError'
});

module.exports = function constantError(x) {
  return new P(x);
};
