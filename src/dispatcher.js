const {extend} = require('./utils/objects');
const {VALUE, ERROR, ANY} = require('./constants');
const {concat, removeByPred} = require('./utils/collections');

function callSubscriber(sType, sFn, event) {
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

function Dispatcher() {
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
    let items = this._items;
    for (let i = 0; i < items.length; i++) {
      callSubscriber(items[i].type, items[i].fn, event);
    }
  }
});


module.exports = {callSubscriber, Dispatcher};
