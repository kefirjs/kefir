const map = require('./map');

module.exports = function mapTo(obs, x) {
  return map(obs, () => x).setName(obs, 'mapTo');
};
