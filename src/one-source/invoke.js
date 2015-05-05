const map = require('./map');
const {apply} = require('../utils/functions');

module.exports = function invoke(obs, methodName, args) {

  const fn = (args.length === 0) ?
    ((x) => x[methodName]()) :
    ((x) => apply(x[methodName], x, args));

  return map(obs, fn).setName(obs, 'invoke');
};
