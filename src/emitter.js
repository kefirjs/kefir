module.exports = function emitter(obs) {
  return {
    emit: (x) => obs._emitValue(x),
    error: (x) => obs._emitError(x),
    end: () => obs._emitEnd(),
    emitEvent: (e) => obs._emit(e.type, e.value)
  };
};
