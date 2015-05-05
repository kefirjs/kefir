const map = require('./map');

module.exports = function pluck(obs, propName) {
  return map(obs, (x) => x[propName]).setName(obs, 'pluck');
};
