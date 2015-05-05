const {inherit} = require('../utils/objects');
const Property = require('../property');
const {ERROR, END} = require('../constants');

function P(x) {
  Property.call(this);
  this._send(ERROR, x);
  this._send(END);
}

inherit(P, Property, {
  _name: 'constantError'
});

module.exports = function constantError(x) {
  return new P(x);
};
