import {extend} from './utils/objects';
import {VALUE, ERROR, ANY} from './constants';
import {concat, removeByPred} from './utils/collections';

export function callSubscriber(sType, sFn, event) {
  if (sType === ANY) {
    sFn(event);
  } else if (sType === event.type) {
    if (sType === VALUE || sType === ERROR) {
      sFn(event.value);
    } else {
      sFn();
    }
  }
}

export function Dispatcher() {
  this._items = [];
}

extend(Dispatcher.prototype, {
  add(type, fn) {
    this._items = concat(this._items, [{
      type: type,
      fn: fn
    }]);
    return this._items.length;
  },
  remove(type, fn) {
    this._items = removeByPred(this._items, function(fnData) {
      return fnData.type === type && fnData.fn === fn;
    });
    return this._items.length;
  },
  dispatch(event) {
    var items = this._items;
    for (var i = 0; i < items.length; i++) {
      callSubscriber(items[i].type, items[i].fn, event);
    }
  }
});
