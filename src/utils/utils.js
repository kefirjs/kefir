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

function extend(/*target, mixin1, mixin2...*/) {
  var length = arguments.length
    , result, i, prop;
  if (length === 1) {
    return arguments[0];
  }
  result = arguments[0];
  for (i = 1; i < length; i++) {
    for (prop in arguments[i]) {
      if(own(arguments[i], prop)) {
        result[prop] = arguments[i][prop];
      }
    }
  }
  return result;
}

function inherit(Child, Parent/*[, mixin1, mixin2, ...]*/) {
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
  return toArray(args);
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

function call(fn, context, args) {
  if (context != null) {
    if (!args || args.length === 0) {
      return fn.call(context);
    } else {
      return fn.apply(context, args);
    }
  } else {
    if (!args || args.length === 0) {
      return fn();
    }
    switch (args.length) {
      case 1: return fn(args[0]);
      case 2: return fn(args[0], args[1]);
      case 3: return fn(args[0], args[1], args[2]);
    }
    return fn.apply(null, args);
  }
}

function bind(fn, c, a, length) {
  if (c == null) {
    if (a.length === 0) {
      return fn;
    }
    switch (length) {
      case 0:
        switch (a.length) {
          case 1: return function() {return fn(a[0])}
          case 2: return function() {return fn(a[0], a[1])}
          case 3: return function() {return fn(a[0], a[1], a[3])}
          case 4: return function() {return fn(a[0], a[1], a[3], a[4])}
          default: return function() {return fn.apply(null, a)}
        }
        break;
      case 1:
        switch (a.length) {
          case 1: return function(b) {return fn(a[0], b)}
          case 2: return function(b) {return fn(a[0], a[1], b)}
          case 3: return function(b) {return fn(a[0], a[1], a[3], b)}
          case 4: return function(b) {return fn(a[0], a[1], a[3], a[4], b)}
          default: return function(b) {return fn.apply(null, concat(a, [b]))}
        }
        break;
      case 2:
        switch (a.length) {
          case 1: return function(b, d) {return fn(a[0], b, d)}
          case 2: return function(b, d) {return fn(a[0], a[1], b, d)}
          case 3: return function(b, d) {return fn(a[0], a[1], a[3], b, d)}
          case 4: return function(b, d) {return fn(a[0], a[1], a[3], a[4], b, d)}
          default: return function(b, d) {return fn.apply(null, concat(a, [b, d]))}
        }
        break;
      default: return function() {return fn.apply(null, concat(a, arguments))}
    }
  } else {
    switch (length) {
      case 0:
        switch (a.length) {
          case 0: return function() {return fn.call(c)}
          case 1: return function() {return fn.call(c, a[0])}
          case 2: return function() {return fn.call(c, a[0], a[1])}
          case 3: return function() {return fn.call(c, a[0], a[1], a[3])}
          case 4: return function() {return fn.call(c, a[0], a[1], a[3], a[4])}
          default: return function() {return fn.apply(c, a)}
        }
        break;
      case 1:
        switch (a.length) {
          case 0: return function(b) {return fn.call(c, b)}
          case 1: return function(b) {return fn.call(c, a[0], b)}
          case 2: return function(b) {return fn.call(c, a[0], a[1], b)}
          case 3: return function(b) {return fn.call(c, a[0], a[1], a[3], b)}
          case 4: return function(b) {return fn.call(c, a[0], a[1], a[3], a[4], b)}
          default: return function(b) {return fn.apply(c, concat(a, [b]))}
        }
        break;
      case 2:
        switch (a.length) {
          case 0: return function(b, d) {return fn.call(c, b, d)}
          case 1: return function(b, d) {return fn.call(c, a[0], b, d)}
          case 2: return function(b, d) {return fn.call(c, a[0], a[1], b, d)}
          case 3: return function(b, d) {return fn.call(c, a[0], a[1], a[3], b, d)}
          case 4: return function(b, d) {return fn.call(c, a[0], a[1], a[3], a[4], b, d)}
          default: return function(b, d) {return fn.apply(c, concat(a, [b, d]))}
        }
        break;
      default: return function() {return fn.apply(c, concat(a, arguments))}
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

function toArray(arrayLike) {
  if (isArray(arrayLike)) {
    return arrayLike;
  } else {
    return cloneArray(arrayLike);
  }
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
