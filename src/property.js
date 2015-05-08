const {inherit} = require('./utils/objects');
const {VALUE, ERROR, END} = require('./constants');
const {callSubscriber} = require('./dispatcher');
const Observable = require('./observable');
const _Event = require('./event');
const Event = _Event;



function Property() {
  Observable.call(this);
  this._currentEvent = null;
}

inherit(Property, Observable, {

  _name: 'property',

  _emitValue(x) {
    if (this._alive) {
      if (!this._activating) {
        this._dispatcher.dispatch(Event(VALUE, x, this._activating));
      }
      this._currentEvent = Event(VALUE, x, true);
    }
  },

  _emitError(x) {
    if (this._alive) {
      if (!this._activating) {
        this._dispatcher.dispatch(Event(ERROR, x, this._activating));
      }
      this._currentEvent = Event(ERROR, x, true);
    }
  },

  _emitEnd() {
    if (this._alive) {
      if (!this._activating) {
        this._dispatcher.dispatch(Event(END, null, this._activating));
      }
      this._clear();
    }
  },


  _on(type, fn) {
    if (this._alive) {
      this._dispatcher.add(type, fn);
      this._setActive(true);
    }
    if (this._currentEvent !== null) {
      callSubscriber(type, fn, this._currentEvent);
    }
    if (!this._alive) {
      callSubscriber(type, fn, Event(END, undefined, true));
    }
    return this;
  },

  getType() {
    return 'property';
  }

});

module.exports = Property;






