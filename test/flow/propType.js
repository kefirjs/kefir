/* @flow */

import Kefir from '../../kefir'

const prop = Kefir.constant(1)

prop.onValue(x => {
  const n: number = x
  // $ExpectError
  const s: string = x
})
