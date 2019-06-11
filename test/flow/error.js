/* @flow */

import Kefir from '../../kefir'

// error type should be persisted through and unaffected by map call.
const prop = Kefir.constantError(1)
  .merge(Kefir.constant(2))
  .map(x => String(x))
  .mapErrors(err => ({a: err}))

prop
  .onValue(x => {
    const good: string = x
    // $ExpectError
    const bad: number = x
  })
  .onError(x => {
    const good: {a: number} = x
    // $ExpectError
    const bad: string = x
  })
