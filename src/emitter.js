const {VALUE, ERROR, END} = require('./constants');


module.exports = function emitter(obs) {
  return {
    emit: (x) => obs._send(VALUE, x),
    error: (x) => obs._send(ERROR, x),
    end: () => obs._send(END),
    emitEvent: (e) => obs._send(e.type, e.value)
  };
};
