const withTwoSources = require('./utils/with-two-sources-helper');
const {NOTHING} = require('./constants');
const {extend, get} = require('./utils/objects');


let withTwoSourcesAndBufferMixin = {
  _init(args) {
    this._buff = [];
    this._flushOnEnd = get(args[0], 'flushOnEnd', true);
  },
  _free() {
    this._buff = null;
  },
  _flush() {
    if (this._buff !== null && this._buff.length !== 0) {
      this._emitValue(this._buff);
      this._buff = [];
    }
  },

  _handlePrimaryEnd() {
    if (this._flushOnEnd) {
      this._flush();
    }
    this._emitEnd();
  }
};



withTwoSources('bufferBy', extend({

  _onActivation() {
    this._primary.onAny(this._$handlePrimaryAny);
    if (this._alive && this._secondary !== null) {
      this._secondary.onAny(this._$handleSecondaryAny);
    }
  },

  _handlePrimaryValue(x) {
    this._buff.push(x);
  },

  _handleSecondaryValue(x) {
    this._flush();
  },

  _handleSecondaryEnd(x) {
    if (!this._flushOnEnd) {
      this._emitEnd();
    }
  }

}, withTwoSourcesAndBufferMixin));




withTwoSources('bufferWhileBy', extend({

  _handlePrimaryValue(x) {
    this._buff.push(x);
    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
      this._flush();
    }
  },

  _handleSecondaryEnd(x) {
    if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
      this._emitEnd();
    }
  }

}, withTwoSourcesAndBufferMixin));





withTwoSources('filterBy', {

  _handlePrimaryValue(x) {
    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
      this._emitValue(x);
    }
  },

  _handleSecondaryEnd() {
    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
      this._emitEnd();
    }
  }

});



withTwoSources('skipUntilBy', {

  _handlePrimaryValue(x) {
    if (this._lastSecondary !== NOTHING) {
      this._emitValue(x);
    }
  },

  _handleSecondaryEnd() {
    if (this._lastSecondary === NOTHING) {
      this._emitEnd();
    }
  }

});



withTwoSources('takeUntilBy', {

  _handleSecondaryValue(x) {
    this._emitEnd();
  }

});



withTwoSources('takeWhileBy', {

  _handlePrimaryValue(x) {
    if (this._lastSecondary !== NOTHING) {
      this._emitValue(x);
    }
  },

  _handleSecondaryValue(x) {
    this._lastSecondary = x;
    if (!this._lastSecondary) {
      this._emitEnd();
    }
  },

  _handleSecondaryEnd() {
    if (this._lastSecondary === NOTHING) {
      this._emitEnd();
    }
  }

});




withTwoSources('skipWhileBy', {

  _init() {
    this._hasFalseyFromSecondary = false;
  },

  _handlePrimaryValue(x) {
    if (this._hasFalseyFromSecondary) {
      this._emitValue(x);
    }
  },

  _handleSecondaryValue(x) {
    this._hasFalseyFromSecondary = this._hasFalseyFromSecondary || !x;
  },

  _handleSecondaryEnd() {
    if (!this._hasFalseyFromSecondary) {
      this._emitEnd();
    }
  }

});
