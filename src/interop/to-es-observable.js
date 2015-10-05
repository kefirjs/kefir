const {extend} = require('../utils/objects');

function ESObservable(observable) {
  this._observable = observable.takeErrors(1);
}

extend(ESObservable.prototype, {
  subscribe(observer) {
    let fn = function(event) {
      if (event.type === "value" && observer.next) {
        observer.next(event.value);
      } else if (event.type == "error" && observer.error) {
        observer.error(event.value);
      } else if (event.type === "end" && observer.complete) {
        observer.complete(event.value);
      }
    }

    this._observable.onAny(fn);
    return () => this._observable.offAny(fn);
  }
});


module.exports = function toESObservable() {
  return new ESObservable(this);
};
