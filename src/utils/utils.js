var NOTHING = ['<nothing>'];

function id(x) {return x}

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

function isArray(xs) {
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

function toStream(obs) {
  if (obs instanceof Stream) {
    return obs;
  } else {
    return obs.changes();
  }
}

function toProperty(obs) {
  if (obs instanceof Stream) {
    return obs.toProperty();
  } else {
    return obs;
  }
}
