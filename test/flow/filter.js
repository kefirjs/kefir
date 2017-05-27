/* @flow */

import Kefir from '../../kefir'

Kefir.sequentially(10, [5, null])
  .onValue(x => {
    const good: ?number = x
    // $ExpectError
    const bad1: number = x
    // $ExpectError
    const bad2: null = x
  })
  .filter()
  .onValue(x => {
    const good: number = x
    // $ExpectError
    const bad: null = x
  })

Kefir.sequentially(10, [5, null])
  .onValue(x => {
    const good: ?number = x
    // $ExpectError
    const bad1: number = x
    // $ExpectError
    const bad2: null = x
  })
  .filter(Boolean)
  .onValue(x => {
    const good: number = x
    // $ExpectError
    const bad: null = x
  })

Kefir.sequentially(10, [5, null])
  .onValue(x => {
    const good: ?number = x
    // $ExpectError
    const bad1: number = x
    // $ExpectError
    const bad2: null = x
  })
  .filter(x => true)
  .onValue(x => {
    const good: ?number = x
    // $ExpectError
    const bad: number = x
  })
