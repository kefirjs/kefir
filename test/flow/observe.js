/* @flow */

import Kefir from '../../kefir';

const s1: Kefir.Observable<number> = Kefir.constant(1);

s1.observe({
  value(x) {
    const good: number = x;
    // $ExpectError
    const bad: string = x;
  },
  error: e => {},
});

class MyObserver {
  value(x) {
    const good: number = x;
    // $ExpectError
    const bad: string = x;
  }
  error(e) {}
}

s1.observe(new MyObserver());
