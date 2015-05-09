function getGlodalPromise() {
  if (typeof Promise === 'function') {
    return Promise;
  } else {
    throw new Exception('There isn\'t default Promise, use shim or parameter');
  }
}

module.exports = function(obs, Promise = getGlodalPromise()) {
  let last = null;
  return new Promise((resolve, reject) => {
    obs.onAny(event => {
      if (event.type === 'end' && last !== null) {
        (last.type === 'value' ? resolve : reject)(last.value);
        last = null;
      } else {
        last = event;
      }
    });
  });
}
