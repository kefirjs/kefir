var NOTHING = ['<nothing>'];

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };
