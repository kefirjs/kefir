import {inherit} from './utils/objects';
import {VALUE, ERROR, END} from './constants';
import {callSubscriber} from './dispatcher';
import Observable from './observable';



function Property() {
  Observable.call(this);
}

inherit(Property, Observable, {

  _name: 'property',

  _emitValue(value) {
    if (this._alive) {
      this._latestEvent = {type: VALUE, value};
      if (!this._activating) {
        this._dispatcher.dispatch(this._latestEvent);
      }
    }
  },

  _emitError(value) {
    if (this._alive) {
      this._latestEvent = {type: ERROR, value};
      if (!this._activating) {
        this._dispatcher.dispatch(this._latestEvent);
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
    if (this._latestEvent !== null) {
      callSubscriber(type, fn, this._latestEvent);
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

export default Property;






