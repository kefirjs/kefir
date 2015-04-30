export function get(map, key, notFound) {
  if (map && key in map) {
    return map[key];
  } else {
    return notFound;
  }
}

export function own(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function createObj(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F();
}

export function extend(target /*, mixin1, mixin2...*/) {
  var length = arguments.length
    , i, prop;
  for (i = 1; i < length; i++) {
    for (prop in arguments[i]) {
      target[prop] = arguments[i][prop];
    }
  }
  return target;
}

export function inherit(Child, Parent /*, mixin1, mixin2...*/) {
  var length = arguments.length
    , i;
  Child.prototype = createObj(Parent.prototype);
  Child.prototype.constructor = Child;
  for (i = 2; i < length; i++) {
    extend(Child.prototype, arguments[i]);
  }
  return Child;
}
