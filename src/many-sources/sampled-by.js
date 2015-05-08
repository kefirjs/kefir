const combine = require('./combine');
const {apply} = require('../utils/functions');
const {circleShift} = require('../utils/collections');

module.exports = function sampledBy(passive, active, combinator) {

  let _combinator = combinator;

  // we need to flip `passive` and `active` in combinator function
  if (passive.length > 0) {
    _combinator = function() {
      let args = circleShift(arguments, passive.length);
      return combinator ? apply(combinator, null, args) : args;
    };
  }

  return combine(active, passive, _combinator).setName('sampledBy');
}

