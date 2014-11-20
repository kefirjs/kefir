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

function bindWithoutContext(fn, a, length) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
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
}

function bindWithContext(fn, c, a, length) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
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

function bind(fn, context, args, boundFunctionLength) {
  if (context == null) {
    return bindWithoutContext(fn, args, boundFunctionLength);
  } else {
    return bindWithContext(fn, context, args, boundFunctionLength);
  }
}








// array functions (a.k.a fnMeta) helpers

function normFnMeta(fnMeta) {
  var fn, context, args;
  if (fnMeta instanceof _Fn) {
    return fnMeta;
  } else {
    if (isFn(fnMeta)) {
      return {fn: fnMeta, context: null, args: []};
    } else {
      if (isArrayLike(fnMeta)) {
        context = (fnMeta[1] == null ? null : fnMeta[1]);
        fn = fnMeta[0];
        args = rest(fnMeta, 2, []);
        if (!isFn(fn)) {
          if (context !== null && isFn(context[fn])) {
            fn = context[fn];
          } else {
            throw new Error('Object isn\'t a function, and can\'t be converted to it: ' + fnMeta);
          }
        }
        return {fn: fn, context: context, args: args};
      } else {
        throw new Error('Object isn\'t a function, and can\'t be converted to it: ' + fnMeta);
      }
    }
  }
}

function applyFnMeta(fnMeta, args) {
  fnMeta = normFnMeta(fnMeta);
  return apply(fnMeta.fn, fnMeta.context, concat(fnMeta.args, args));
}

function buildFn(fnMeta, length) {
  fnMeta = normFnMeta(fnMeta);
  return bind(fnMeta.fn, fnMeta.context, fnMeta.args, length);
}

function buildFnSpread(fnMeta, length) {
  fnMeta = normFnMeta(fnMeta);
  // TODO inline `bind`?
  var fn = bind(fnMeta.fn, fnMeta.context, fnMeta.args, length);
  switch (length) {
    case 0: return function(xs) {return fn()};
    case 1: return function(xs) {return fn(xs[0])};
    case 2: return function(xs) {return fn(xs[0], xs[1])};
    case 3: return function(xs) {return fn(xs[0], xs[1], xs[2])};
    case 4: return function(xs) {return fn(xs[0], xs[1], xs[2], xs[3])};
    default: return function(xs) {return fn.apply(null, xs)};
  }
}





// Fn class

function _Fn(fnMeta, length) {
  this.context = fnMeta.context;
  this.fn = fnMeta.fn;
  this.args = fnMeta.args;
  this.invoke = bind(this.fn, this.context, this.args, length);
}

_Fn.prototype.apply = function(args) {
  return apply(this.invoke, null, args);
}

_Fn.prototype.applyWithContext = function(context, args) {
  if (this.context === null) {
    return apply(this.fn, context, concat(this.args, args));
  } else {
    return this.apply(args);
  }
}

function Fn(fnMeta, length) {
  if (fnMeta instanceof _Fn) {
    return fnMeta;
  } else {
    return new _Fn(normFnMeta(fnMeta), length == null ? 100 : length);
  }
}

Fn.isEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  a = Fn(a);
  b = Fn(b);
  return a.fn === b.fn &&
    a.context === b.context &&
    isEqualArrays(a.args, b.args);
}

Kefir.Fn = Fn;
