var NOTHING = ['<nothing>'];
var END = 'end';
var VALUE = 'value';
var ERROR = 'error';
var ANY = 'any';

function noop() {}

function id(x) {
  return x;
}

function id2(_, x) {
  return x;
}

function strictEqual(a, b) {
  return a === b;
}

function defaultDiff(a, b) {
  return [a, b];
}

var now = Date.now ?
  function() {
    return Date.now();
  } :
  function() {
    return new Date().getTime();
  };

var log = ((typeof console !== undefined) && isFn(console.log)) ?
  function(m) {
    console.log(m);
  } : noop;
