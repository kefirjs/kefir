export function isFn(fn) {
  return typeof fn === 'function';
}

export function isUndefined(x) {
  return typeof x === 'undefined';
}

export function isArrayLike(xs) {
  return isArray(xs) || isArguments(xs);
}

export const isArray = Array.isArray || function(xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

export const isArguments = (function() {
  function isArguments(obj) {
    return Object.prototype.toString.call(obj) === '[object Arguments]';
  }
  function isArgumentsIE8(obj) {
    return !!obj.callee;
  }
  return isArguments(arguments) ? isArguments : isArgumentsIE8;
}());
