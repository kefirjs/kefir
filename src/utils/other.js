var NOTHING = ['<nothing>'];
var END = 'end';
var VALUE = 'value';
var ANY = 'any';

function noop() {}

function id(x){
  return x;
}

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };
