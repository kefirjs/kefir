const {VALUE, END} = require('../constants');

function getGlodalPromise() {
  if (typeof Promise === 'function') {
    return Promise;
  } else {
    throw new Error('There isn\'t default Promise, use shim or parameter');
  }
}

module.exports = function(obs, Promise = getGlodalPromise()) {
  let last = null;
  return new Promise((resolve, reject) => {
    obs.onAny(event => {
      if (event.type === END && last !== null) {
        (last.type === VALUE ? resolve : reject)(last.value);
        last = null;
      } else {
        last = event;
      }
    });
  });
}
