const map = require('./map');
const now = require('../utils/now');

module.exports = function timestamp(obs) {
  return map(obs, (x) => ({value: x, time: now()})).setName(obs, 'timestamp');
};
