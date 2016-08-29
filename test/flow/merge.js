/* @flow */

import Kefir from '../../kefir';

const s1: Kefir.Observable<number> = Kefir.constant(1);
const s2: Kefir.Observable<string> = Kefir.constant('two');
const s3 = Kefir.constantError({foo: 1});

const merged = Kefir.merge([s1, s2, s3]);

merged.observe(x => {
  const good: number|string = x;
  // $ExpectError
  const bad1: number = x;
  // $ExpectError
  const bad2: string = x;
}, err => {
  const good: {foo: number} = err;
  // $ExpectError
  const bad: number = err;
});
