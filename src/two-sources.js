withTwoSources('filterBy', {

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
      this._send('value', x, isCurrent);
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
      this._send('end', null, isCurrent);
    }
  }

});



withTwoSources('waitFor', {

  _init: function() {
    this._secondary = this._secondary.take(1);
  },

  _handlePrimaryValue: function(x, isCurrent) {
    if (this._lastSecondary !== NOTHING) {
      this._send('value', x, isCurrent);
    }
  },

  _handleSecondaryEnd: function(__, isCurrent) {
    if (this._lastSecondary === NOTHING) {
      this._send('end', null, isCurrent);
    }
  }

});
