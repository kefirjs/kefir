const map = require('./map');

module.exports = function not(obs) {
  return map(obs, (x) => !x).setName(obs, 'not');
};
