const {extend} = require('./utils/objects');
const {VALUE, ERROR, ANY} = require('./constants');
const {concat, removeByPred} = require('./utils/collections');

function callSubscriber(type, fn, event) {
  if (type === ANY) {
    fn(event);
  } else if (type === event.type) {
    if (type === VALUE || type === ERROR) {
      fn(event.value);
    } else {
      fn();
    }
  }
}

function Dispatcher() {
  this._items = [];
}

extend(Dispatcher.prototype, {

  add(type, fn) {
    this._items = concat(this._items, [{type, fn}]);
    return this._items.length;
  },

  remove(type, fn) {
    this._items = removeByPred(this._items, (x) => x.type === type && x.fn === fn);
    return this._items.length;
  },

  dispatch(event) {
    for (let i = 0, items = this._items; i < items.length; i++) {
      callSubscriber(items[i].type, items[i].fn, event);
    }
  }

});


module.exports = {callSubscriber, Dispatcher};
