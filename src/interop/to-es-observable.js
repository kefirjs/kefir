import $$observable from 'symbol-observable';
import {extend} from '../utils/objects';
import {VALUE, ERROR, END} from '../constants';

function ESObservable(observable) {
  this._observable = observable.takeErrors(1);
}

extend(ESObservable.prototype, {
  subscribe(observerOrOnNext, onError, onComplete) {

    const observer = typeof observerOrOnNext === 'function'
      ? {next: observerOrOnNext, error: onError, complete: onComplete}
      : observerOrOnNext

    const fn = event => {
      if (event.type === VALUE && observer.next) {
        observer.next(event.value);
      } else if (event.type === ERROR && observer.error) {
        observer.error(event.value);
      } else if (event.type === END && observer.complete) {
        observer.complete(event.value);
      }
    }

    this._observable.onAny(fn);
    const subscription = {
      unsubscribe: () => {
        subscription.closed = true;
        this._observable.offAny(fn);
      },
      closed: false
    };
    return subscription;

  }
});

// Need to assign directly b/c Symbols aren't enumerable.
ESObservable.prototype[$$observable] = function() {
  return this;
};

export default function toESObservable() {
  return new ESObservable(this);
}
