export default function emitter(obs) {

  function next(x) {
    obs._emitValue(x);
    return obs._active;
  }

  function error(x) {
    obs._emitError(x);
    return obs._active;
  }

  function complete() {
    obs._emitEnd();
    return obs._active;
  }

  function emitEvent(e) {
    obs._emit(e.type, e.value);
    return obs._active;
  }

  return {
    next,
    error,
    complete,
    emitEvent,

    // legacy
    end: complete,
    emit: next
  };
}
