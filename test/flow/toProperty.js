/* @flow */

import Kefir from '../../kefir'

function test_toProperty() {
  const xs = Kefir.sequentially(0, [1, 2, 3, 4])
  const p = xs.toProperty()

  p.onValue((x: number) => {})

  // $ExpectError
  p.onValue((x: string) => {})
}

function test_toProperty_getCurrent() {
  const xs = Kefir.sequentially(0, [1, 2, 3, 4])
  const p = xs.toProperty(() => 'foo')

  p.onValue((x: number | string) => {})

  // $ExpectError
  p.onValue((x: number) => {})
}
