var NOTHING = ['<nothing>'];

function get(map, key, notFound) {
  if (map && key in map) {
    return map[key];
  } else {
    return notFound;
  }
}

function own(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function createObj(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F();
}

function extend(target /*, mixin1, mixin2...*/) {
  var length = arguments.length
    , i, prop;
  for (i = 1; i < length; i++) {
    for (prop in arguments[i]) {
      target[prop] = arguments[i][prop];
    }
  }
  return target;
}

function inherit(Child, Parent /*, mixin1, mixin2...*/) {
  var length = arguments.length
    , i;
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  for (i = 2; i < length; i++) {
    extend(Child.prototype, arguments[i]);
  }
  return Child;
}

function agrsToArray(args) {
  if (args.length === 1 && isArray(args[0])) {
    return args[0];
  }
  return cloneArray(args);
}

function getFn(fn, context) {
  if (isFn(fn)) {
    return fn;
  } else {
    if (context == null || !isFn(context[fn])) {
      throw new Error('not a function: ' + fn + ' in ' + context);
    } else {
      return context[fn];
    }
  }
}

function apply(fn, c, a) {
  var aLength = a ? a.length : 0;
  if (c == null) {
    switch (aLength) {
      case 0:  return fn();
      case 1:  return fn(a[0]);
      case 2:  return fn(a[0], a[1]);
      case 3:  return fn(a[0], a[1], a[2]);
      case 4:  return fn(a[0], a[1], a[2], a[3]);
      default: return fn.apply(null, a);
    }
  } else {
    switch (aLength) {
      case 0:  return fn.call(c);
      default: return fn.apply(c, a);
    }
  }
}

function bind(fn, c, a, length) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  if (c == null) {
    switch (length) {
      case 0:
        switch (a.length) {
          case 0:  return fn;
          case 1:  return function() {return fn(a0)}
          case 2:  return function() {return fn(a0, a1)}
          case 3:  return function() {return fn(a0, a1, a2)}
          case 4:  return function() {return fn(a0, a1, a2, a3)}
          default: return function() {return fn.apply(null, a)}
        }
        break;
      case 1:
        switch (a.length) {
          case 0:  return fn;
          case 1:  return function(b0) {return fn(a0, b0)}
          case 2:  return function(b0) {return fn(a0, a1, b0)}
          case 3:  return function(b0) {return fn(a0, a1, a2, b0)}
          case 4:  return function(b0) {return fn(a0, a1, a2, a3, b0)}
          default: return function(b0) {return fn.apply(null, concat(a, [b0]))}
        }
        break;
      case 2:
        switch (a.length) {
          case 0:  return fn;
          case 1:  return function(b0, b1) {return fn(a0, b0, b1)}
          case 2:  return function(b0, b1) {return fn(a0, a1, b0, b1)}
          case 3:  return function(b0, b1) {return fn(a0, a1, a2, b0, b1)}
          case 4:  return function(b0, b1) {return fn(a0, a1, a2, a3, b0, b1)}
          default: return function(b0, b1) {return fn.apply(null, concat(a, [b0, b1]))}
        }
        break;
      default:
        switch (a.length) {
          case 0:  return fn;
          default: return function() {return apply(fn, null, concat(a, arguments))}
        }
    }
  } else {
    switch (length) {
      case 0:
        switch (a.length) {
          case 0:  return function() {return fn.call(c)}
          default: return function() {return fn.apply(c, a)}
        }
        break;
      case 1:
        switch (a.length) {
          case 0:  return function(b0) {return fn.call(c, b0)}
          case 1:  return function(b0) {return fn.call(c, a0, b0)}
          case 2:  return function(b0) {return fn.call(c, a0, a1, b0)}
          case 3:  return function(b0) {return fn.call(c, a0, a1, a2, b0)}
          case 4:  return function(b0) {return fn.call(c, a0, a1, a2, a3, b0)}
          default: return function(b0) {return fn.apply(c, concat(a, [b0]))}
        }
        break;
      case 2:
        switch (a.length) {
          case 0:  return function(b0, b1) {return fn.call(c, b0, b1)}
          case 1:  return function(b0, b1) {return fn.call(c, a0, b0, b1)}
          case 2:  return function(b0, b1) {return fn.call(c, a0, a1, b0, b1)}
          case 3:  return function(b0, b1) {return fn.call(c, a0, a1, a2, b0, b1)}
          case 4:  return function(b0, b1) {return fn.call(c, a0, a1, a2, a3, b0, b1)}
          default: return function(b0, b1) {return fn.apply(c, concat(a, [b0, b1]))}
        }
        break;
      default:
        switch (a.length) {
          case 0: return function() {return fn.apply(c, arguments)}
          default: return function() {return fn.apply(c, concat(a, arguments))}
        }
    }
  }
}

function concat(a, b) {
  var result = new Array(a.length + b.length)
    , j = 0
    , length, i;
  length = a.length;
  for (i = 0; i < length; i++, j++) {
    result[j] = a[i];
  }
  length = b.length;
  for (i = 0; i < length; i++, j++) {
    result[j] = b[i];
  }
  return result;
}

function cloneArray(input) {
  var length = input.length
    , result = new Array(length)
    , i;
  for (i = 0; i < length; i++) {
    result[i] = input[i];
  }
  return result;
}

function map(input, fn) {
  var length = input.length
    , result = new Array(length)
    , i;
  for (i = 0; i < length; i++) {
    result[i] = fn(input[i]);
  }
  return result;
}

function fillArray(arr, value) {
  var length = arr.length
    , i;
  for (i = 0; i < length; i++) {
    arr[i] = value;
  }
}

function contains(arr, value) {
  var length = arr.length
    , i;
  for (i = 0; i < length; i++) {
    if (arr[i] === value) {
      return true;
    }
  }
  return false;
}

function rest(arr, start, onEmpty) {
  if (arr.length > start) {
    return Array.prototype.slice.call(arr, start);
  }
  return onEmpty;
}

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };

function isFn(fn) {
  return typeof fn === 'function';
}

function isUndefined(x) {
  return typeof x === 'undefined';
}

function isArrayLike(xs) {
  return isArray(xs) || isArguments(xs);
}

var isArray = Array.isArray || function(xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
}

var isArguments = function(xs) {
  return Object.prototype.toString.call(xs) === '[object Arguments]';
}

// For IE
if (!isArguments(arguments)) {
  isArguments = function(obj) {
    return !!(obj && own(obj, 'callee'));
  }
}

function isEqualArrays(a, b) {
  var length, i;
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (i = 0, length = a.length; i < length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function and() {
  for (var i = 0; i < arguments.length; i++) {
    if (!arguments[i]) {
      return arguments[i];
    }
  }
  return arguments[i - 1];
}

function or() {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i]) {
      return arguments[i];
    }
  }
  return arguments[i - 1];
}
