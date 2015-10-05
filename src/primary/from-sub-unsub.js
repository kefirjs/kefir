const stream = require('./stream');
const {apply} = require('../utils/functions');

module.exports = function fromSubUnsub(sub, unsub, transformer /* Function | falsey */) {
  return stream(function(emitter) {

    let handler = transformer
      ? function() {
        emitter.emit(apply(transformer, this, arguments));
      }
      : x => {
        emitter.emit(x)
      };

    sub(handler);
    return () => unsub(handler);

  }).setName('fromSubUnsub');
}
