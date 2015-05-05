const map = require('./map');

module.exports = function tap(obs, fn) {
  return map(obs, (x) => {fn(x); return x}).setName(obs, 'tap');
};
