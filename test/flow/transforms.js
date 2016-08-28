/* @flow */

import Kefir from '../../kefir';

const prop = Kefir.constant(1)
  .map(x => {
    const n: number = x;
    // $ExpectError
    const s: string = x;
    return String(x);
  })
  .flatMap(x => {
    const s: string = x;
    // $ExpectError
    const n: number = x;
    return Kefir.later(10, parseInt(x));
  })
  .filter(x => {
    const n: number = x;
    // $ExpectError
    const s: string = x;
    return true;
  })
  .flatMap(x => {
    if (Math.random() == 0) {
      return Kefir.never();
    } else {
      return Kefir.constant(String(x));
    }
  });

prop.onValue(x => {
  const s: string = x;
  // $ExpectError
  const n: number = x;
});
