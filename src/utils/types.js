function isFn(fn) {
  return typeof fn === 'function';
}

function isUndefined(x) {
  return typeof x === 'undefined';
}

function isArrayLike(xs) {
  return isArray(xs) || isArguments(xs);
}

const isArray = Array.isArray || function(xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

const isArguments = (function() {
  function isArguments(obj) {
    return Object.prototype.toString.call(obj) === '[object Arguments]';
  }
  function isArgumentsIE8(obj) {
    return !!obj.callee;
  }
  return isArguments(arguments) ? isArguments : isArgumentsIE8;
}());


module.exports = {isFn, isUndefined, isArrayLike, isArray, isArguments};
