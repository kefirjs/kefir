const {inherit} = require('./utils/objects');
const {VALUE, ERROR, END} = require('./constants');
const {callSubscriber} = require('./dispatcher');
const Observable = require('./observable');



function Property() {
  Observable.call(this);
  this._currentEvent = null;
}

inherit(Property, Observable, {

  _name: 'property',

  _emitValue(value) {
    if (this._alive) {
      this._currentEvent = {type: VALUE, value};
      if (!this._activating) {
        this._dispatcher.dispatch({type: VALUE, value});
      }
    }
  },

  _emitError(value) {
    if (this._alive) {
      this._currentEvent = {type: ERROR, value};
      if (!this._activating) {
        this._dispatcher.dispatch({type: ERROR, value});
      }
    }
  },

  _emitEnd() {
    if (this._alive) {
      this._alive = false
      if (!this._activating) {
        this._dispatcher.dispatch({type: END});
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
      callSubscriber(type, fn, {type: END});
    }
    return this;
  },

  getType() {
    return 'property';
  }

});

module.exports = Property;






