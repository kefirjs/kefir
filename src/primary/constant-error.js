const {inherit} = require('../utils/objects');
const Property = require('../property');


// HACK:
//   We don't call parent Class constructor, but instead putting all necessary
//   properties into prototype to simulate ended Property
//   (see Propperty and Observable classes).

function P(value) {
  this._currentEvent = {type: 'error', value, current: true};
}

inherit(P, Property, {
  _name: 'constantError',
  _active: false,
  _activating: false,
  _alive: false,
  _dispatcher: null,
  _logHandlers: null
});

module.exports = function constantError(x) {
  return new P(x);
};
