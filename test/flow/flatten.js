/* @flow */

import Kefir from '../../kefir'

function test_flatten() {
  const source = Kefir.sequentially(0, [[1], [2, 2], [3, 3, 3]])
  const xs = source.flatten()

  xs.onValue((x: number) => {})
}

function test_flatten_withTransformer() {
  const source = Kefir.sequentially(0, [1, 2, 3, 4])
  const xs = source.flatten(x => ['foo', 'bar'])

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}
