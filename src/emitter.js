module.exports = function emitter(obs) {

  const value = (x) => obs._emitValue(x);
  const error = (x) => obs._emitError(x);
  const end = () => obs._emitEnd();
  const event = (e) => obs._emit(e.type, e.value);

  return {value, error, end, event, emit: value, emitEvent: event};
};
