/* @flow */

import Kefir from '../../kefir';

const pool: Kefir.Pool<number> = Kefir.pool();
pool.plug(Kefir.constant(1));
// $ExpectError
pool.plug(Kefir.constant('a'));

pool.onValue(x => {
  const n: number = x;
  // $ExpectError
  const s: string = x;
});
