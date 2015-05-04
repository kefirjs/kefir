const Stream = require('../stream');
const {VALUE, ERROR, END, NOTHING} = require('../constants');
const {inherit} = require('../utils/objects');
const {concat, fillArray} = require('../utils/collections');
const {spread} = require('../utils/functions');
const never = require('../primary/never');



function defaultErrorsCombinator(errors) {
  let latestError;
  for (let i = 0; i < errors.length; i++) {
    if (errors[i] !== undefined) {
      if (latestError === undefined || latestError.index < errors[i].index) {
        latestError = errors[i];
      }
    }
  }
  return latestError.error;
}

function Combine(active, passive, combinator) {
  Stream.call(this);
  this._activeCount = active.length;
  this._sources = concat(active, passive);
  this._combinator = combinator ? spread(combinator, this._sources.length) : (x => x);
  this._aliveCount = 0;
  this._latestValues = new Array(this._sources.length);
  this._latestErrors = new Array(this._sources.length);
  fillArray(this._latestValues, NOTHING);
  this._activating = false;
  this._emitAfterActivation = false;
  this._endAfterActivation = false;
  this._latestErrorIndex = 0;

  this._$handlers = Array(this._sources.length);
  for (let i = 0; i < this._sources.length; i++) {
    this._$handlers[i] = this._bindHandleAny(i);
  }

}


inherit(Combine, Stream, {

  _name: 'combine',

  _onActivation() {
    let length = this._sources.length,
        i;
    this._aliveCount = this._activeCount;
    this._activating = true;
    for (i = 0; i < length; i++) {
      this._sources[i].onAny(this._$handlers[i]);
    }
    this._activating = false;
    if (this._emitAfterActivation) {
      this._emitAfterActivation = false;
      this._emitIfFull(true);
    }
    if (this._endAfterActivation) {
      this._send(END, null, true);
    }
  },

  _onDeactivation() {
    let length = this._sources.length,
        i;
    for (i = 0; i < length; i++) {
      this._sources[i].offAny(this._$handlers[i]);
    }
  },

  _emitIfFull(isCurrent) {
    let hasAllValues = true;
    let hasErrors = false;
    let length = this._latestValues.length;
    let valuesCopy = new Array(length);
    let errorsCopy = new Array(length);;

    for (let i = 0; i < length; i++) {
      valuesCopy[i] = this._latestValues[i];
      errorsCopy[i] = this._latestErrors[i];

      if (valuesCopy[i] === NOTHING) {
        hasAllValues = false;
      }

      if (errorsCopy[i] !== undefined) {
        hasErrors = true;
      }
    }

    if (hasAllValues) {
      this._send(VALUE, this._combinator(valuesCopy), isCurrent);
    }
    if (hasErrors) {
      this._send(ERROR, defaultErrorsCombinator(errorsCopy), isCurrent);
    }
  },

  _bindHandleAny(i) {
    let $ = this;
    return function(event) {
      $._handleAny(i, event);
    };
  },

  _handleAny(i, event) {

    if (event.type === VALUE || event.type === ERROR) {

      if (event.type === VALUE) {
        this._latestValues[i] = event.value;
        this._latestErrors[i] = undefined;
      }
      if (event.type === ERROR) {
        this._latestValues[i] = NOTHING;
        this._latestErrors[i] = {
          index: this._latestErrorIndex++,
          error: event.value
        };
      }

      if (i < this._activeCount) {
        if (this._activating) {
          this._emitAfterActivation = true;
        } else {
          this._emitIfFull(event.current);
        }
      }

    } else { // END

      if (i < this._activeCount) {
        this._aliveCount--;
        if (this._aliveCount === 0) {
          if (this._activating) {
            this._endAfterActivation = true;
          } else {
            this._send(END, null, event.current);
          }
        }
      }

    }
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._sources = null;
    this._latestValues = null;
    this._latestErrors = null;
    this._combinator = null;
    this._$handlers = null;
  }

});


module.exports = function combine(active, passive, combinator) {
  return active.length === 0 ? never() : new Combine(active, passive, combinator);
}
