const {extend} = require('./utils/objects');
const {VALUE, ERROR, ANY} = require('./constants');
const {concat, findByPred, remove, contains} = require('./utils/collections');

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
  this._inLoop = 0;
  this._removedItems = null;
}

extend(Dispatcher.prototype, {

  add(type, fn) {
    this._items = concat(this._items, [{type, fn}]);
    return this._items.length;
  },

  remove(type, fn) {
    const index = findByPred(this._items, (x) => x.type === type && x.fn === fn);
    if (this._inLoop !== 0 && index !== -1) {
      if (this._removedItems === null) {
        this._removedItems = [];
      }
      this._removedItems.push(this._items[index]);
    }
    this._items = remove(this._items, index);
    return this._items.length;
  },

  dispatch(event) {
    this._inLoop++;
    for (let i = 0, items = this._items; i < items.length; i++) {
      if (this._items !== null && (this._removedItems === null || !contains(this._removedItems, items[i]))) {
        callSubscriber(items[i].type, items[i].fn, event);
      }
    }
    this._inLoop--;
    if (this._inLoop === 0) {
      this._removedItems = null;
    }
  },

  cleanup() {
    this._items = null;
  }

});


module.exports = {callSubscriber, Dispatcher};
