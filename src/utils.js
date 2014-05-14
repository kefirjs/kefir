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

function inherit(Child, Parent, childPrototype) {
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  if (childPrototype) {
    extend(Child.prototype, childPrototype)
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
      array[i] = null;
    }
  }
}

function isAllDead(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i]) {
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
