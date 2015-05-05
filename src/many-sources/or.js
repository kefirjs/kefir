const combine = require('./combine');

function fn() {
  let i;
  for (i = 0; i < arguments.length; i++) {
    if (arguments[i]) {
      return arguments[i];
    }
  }
  return arguments[i - 1];
}

module.exports = function or(observables) {
  return combine(observables, [], fn).setName('or');
};
