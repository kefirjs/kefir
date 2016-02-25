import stream from '../primary/stream';
import symbol_ from '../utils/symbol';
const symbol = symbol_('observable');

export default function fromESObservable(_observable) {
  const observable = _observable[symbol] ? _observable[symbol]() : _observable;
  return stream(function(emitter) {
    const unsub = observable.subscribe({
      error(error) {
        emitter.error(error);
        emitter.end();
      },
      next(value) {
        emitter.emit(value);
      },
      complete() {
        emitter.end();
      }
    })

    if (unsub.unsubscribe) {
      return function () { unsub.unsubscribe(); };
    } else {
      return unsub;
    }
  }).setName('fromESObservable');
}
