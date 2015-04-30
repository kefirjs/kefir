import {isFn} from './types';
import Kefir from '../kefir';

export const NOTHING = ['<nothing>'];
export const END = 'end';
export const VALUE = 'value';
export const ERROR = 'error';
export const ANY = 'any';

export function noop() {}

export function id(x) {
  return x;
}

export function id2(_, x) {
  return x;
}

export function strictEqual(a, b) {
  return a === b;
}

export function defaultDiff(a, b) {
  return [a, b];
}

export function returnsFalse() {
  return false;
}

export function returnsTrue() {
  return true;
}

export const now = Date.now ?
  function() {
    return Date.now();
  } :
  function() {
    return new Date().getTime();
  };

export const log = ((typeof console !== undefined) && isFn(console.log)) ?
  function(m) {
    console.log(m);
  } : noop;



Kefir.DEPRECATION_WARNINGS = true;
export function deprecated(name, alt, fn) {
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
