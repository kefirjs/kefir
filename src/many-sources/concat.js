const repeat = require('./repeat');

module.exports = function concat(observables) {
  return repeat(function(index) {
    return observables.length > index ? observables[index] : false;
  });
}
