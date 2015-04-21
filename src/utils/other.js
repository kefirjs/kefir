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

function returnsFalse() {
  return false;
}

function returnsTrue() {
  return true;
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



Kefir.DEPRECATION_WARNINGS = true;
function deprecated(name, alt, fn) {
  var message = 'Method `' + name + '` is deprecated, and to be removed in v3.0.0.';
  if (alt) {
    message += '\nUse `' + alt + '` instead.';
  }
  message += '\nTo disable all warnings like this set `Kefir.DEPRECATION_WARNINGS = false`.';
  return function() {
    if (Kefir.DEPRECATION_WARNINGS) {
      log(message);
    }
    return fn.apply(this, arguments);
  };
}
