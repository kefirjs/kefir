function noop(){}

function id(x){return x}

function own(obj, prop){
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function toArray(arrayLike){
  return Array.prototype.slice.call(arrayLike);
}

function createObj(proto) {
  var F = function(){};
  F.prototype = proto;
  return new F();
}

function extend() {
  var objects = toArray(arguments);
  if (objects.length === 1) {
    return objects[0];
  }
  var result = objects.shift();
  for (var i = 0; i < objects.length; i++) {
    for (var prop in objects[i]) {
      if(own(objects[i], prop)) {
        result[prop] = objects[i][prop];
      }
    }
  }
  return result;
}

function inherit(Child, Parent) { // (Child, Parent[, mixin1, mixin2, ...])
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  for (var i = 2; i < arguments.length; i++) {
    extend(Child.prototype, arguments[i]);
  }
  return Child;
}

function inheritMixin(Child, Parent) {
  for (var prop in Parent) {
    if (own(Parent, prop) && !(prop in Child)) {
      Child[prop] = Parent[prop];
    }
  }
  return Child;
}

function removeFromArray(array, value) {
  for (var i = 0; i < array.length;) {
    if (array[i] === value) {
      array.splice(i, 1);
    } else {
      i++;
    }
  }
}

function killInArray(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      delete array[i];
    }
  }
}

function isAllDead(array) {
  for (var i = 0; i < array.length; i++) {
    /*jshint eqnull:true */
    if (array[i] != null) {
      return false;
    }
  }
  return true;
}

function firstArrOrToArr(args) {
  if (Object.prototype.toString.call(args[0]) === '[object Array]') {
    return args[0];
  }
  return toArray(args);
}

function restArgs(args, start, nullOnEmpty){
  if (args.length > start) {
    return Array.prototype.slice.call(args, start);
  }
  if (nullOnEmpty) {
    return null;
  } else {
    return [];
  }
}

function callFn(args/*, moreArgs...*/){
  var fn = args[0];
  var context = args[1];
  var bindedArgs = restArgs(args, 2);
  var moreArgs = restArgs(arguments, 1);
  return fn.apply(context, bindedArgs.concat(moreArgs));
}

function callSubscriber(subscriber/*, moreArgs...*/){
  // subscriber = [
  //   eventName,
  //   fn,
  //   context,
  //   arg1,
  //   arg2,
  //   ...
  // ]
  var fn = subscriber[1];
  var context = subscriber[2];
  var bindedArgs = restArgs(subscriber, 3);
  var moreArgs = restArgs(arguments, 1);
  return fn.apply(context, bindedArgs.concat(moreArgs));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertStream(stream){
  assert(stream instanceof Stream, "not a Stream: " + stream)
}

function assertProperty(property){
  assert(property instanceof Property, "not a Property: " + property)
}

function isFn(fn) {
  return typeof fn === "function";
}

function withName(name, obj){
  obj.__objName = name;
  return obj;
}

function isEqualArrays(a, b){
  /*jshint eqnull:true */
  if (a == null && b == null) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}


