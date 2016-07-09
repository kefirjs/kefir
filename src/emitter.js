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

  function event(e) {
    obs._emit(e.type, e.value);
    return obs._active;
  }

  return {
    next,
    error,
    complete,
    event,

    // legacy
    end: complete,
    emit: next,
    emitEvent: event
  };
}
