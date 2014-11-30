var withTwoSourcesAndBufferMixin = {
  _init: function(args) {
    this._buff = [];
    this._flushOnEnd = get(args[0], 'flushOnEnd', true);
  },
  _free: function() {
    this._buff = null;
  },
  _flush: function(isCurrent) {
    if (this._buff !== null && this._buff.length !== 0) {
      this._send(VALUE, this._buff, isCurrent);
      this._buff = [];
    }
  },

  _handlePrimaryEnd: function(__, isCurrent) {
    if (this._flushOnEnd) {
      this._flush(isCurrent);
    }
    this._send(END, null, isCurrent);
  }
};



withTwoSources('bufferBy', extend({

  _onActivation: function() {
    this._primary.onAny(this._$handlePrimaryAny);
    if (this._alive && this._secondary !== null) {
      this._secondary.onAny(this._$handleSecondaryAny);
    }
  },

  _handlePrimaryValue: function(x, isCurrent) {
    this._buff.push(x);
  },

  _handleSecondaryValue: function(x, isCurrent) {
    this._flush(isCurrent);
  },

  _handleSecondaryEnd: function(x, isCurrent) {
    if (!this._flushOnEnd) {
      this._send(END, null, isCurrent);
    }
  }

}, withTwoSourcesAndBufferMixin));




withTwoSources('bufferWhileBy', extend({

  _handlePrimaryValue: function(x, isCurrent) {
    this._buff.push(x);
    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
      this._flush(isCurrent);
    }
  },

  _handleSecondaryEnd: function(x, isCurrent) {
    if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
      this._send(END, null, isCurrent);
    }
  }

}, withTwoSourcesAndBufferMixin));





withTwoSources('filterBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
      this._send(END, null, isCurrent);
    }
  }

});



withTwoSources('skipUntilBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryValue: function(x) {
    this._lastSecondary = x;
    this._removeSecondary();
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING) {
      this._send(END, null, isCurrent);
    }
  }

});



withTwoSources('takeUntilBy', {

  _handleSecondaryValue: function(x, isCurrent) {
    this._send(END, null, isCurrent);
  }

});



withTwoSources('takeWhileBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryValue: function(x, isCurrent) {
    this._lastSecondary = x;
    if (!this._lastSecondary) {
      this._send(END, null, isCurrent);
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING) {
      this._send(END, null, isCurrent);
    }
  }

});




withTwoSources('skipWhileBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
      this._send(VALUE, x, isCurrent);
    }
  },

  _handleSecondaryValue: function(x, isCurrent) {
    this._lastSecondary = x;
    if (!this._lastSecondary) {
      this._removeSecondary();
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING || this._lastSecondary) {
      this._send(END, null, isCurrent);
    }
  }

});
