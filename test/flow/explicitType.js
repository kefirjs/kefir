/* @flow */

import Kefir from '../../kefir';
import type {Observable} from '../../kefir';

const p1: Observable<{a:number, b:string}> = Kefir.constant({a:1, b:'b'});
// Test that covariant casts are allowed.
const p1c: Observable<{a:number}> = p1;
// $ExpectError
const f1c: Observable<number> = p1;

p1.onValue(v => {
  const good: {a:number, b:string} = v;
  // $ExpectError
  const bad: number = v;
});

// Check that "Kefir.Observable" refers to the type too.
const p2: Kefir.Observable<{a:number, b:string}> = Kefir.constant({a:2, b:'b'});
// $ExpectError
const f2c: Observable<number> = p1;

p2.onValue(v => {
  const good: {a:number, b:string} = v;
  // $ExpectError
  const bad: number = v;
});

// Check that the error type parameter works too.

const p3: Observable<number, string> = Kefir.constantError('foo');
p3.observe(v => {
  const good: number = v;
  // $ExpectError
  const bad: string = v;
}, err => {
  const good: string = err;
  // $ExpectError
  const bad: number = err;
});

// $ExpectError
const bad: Observable<number, number> = Kefir.constantError('foo');
