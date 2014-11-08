var NOTHING = ['<nothing>'];

function noop() {}

function id(x){
  return x;
}

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };
