const fromSubUnsub = require('./from-sub-unsub');
const {isFn} = require('../utils/types');

const pairs = [
  ['addEventListener', 'removeEventListener'],
  ['addListener', 'removeListener'],
  ['on', 'off']
];

module.exports = function fromEvents(target, eventName, transformer) {
  let sub, unsub;

  for (let i = 0; i < pairs.length; i++) {
    if (isFn(target[pairs[i][0]]) && isFn(target[pairs[i][1]])) {
      sub = pairs[i][0];
      unsub = pairs[i][1];
      break;
    }
  }

  if (sub === undefined) {
    throw new Error('target don\'t support any of ' +
      'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
  }

  return fromSubUnsub(
    (handler) => target[sub](eventName, handler),
    (handler) => target[unsub](eventName, handler),
    transformer
  ).setName('fromEvents');
};
