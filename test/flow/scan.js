/* @flow */

import Kefir from '../../kefir'

const source = Kefir.sequentially(10, [1, 2, 3, 4])

function test_scan_noSeed() {
  const xs = source.scan((x, y) => x - y)

  xs.onValue((x: number) => {})
}

function test_scan_withSeed() {
  // $ExpectError
  source.scan((x, y) => x - y, 'foo')

  const xs = source.scan((x, y) => x + String(y), 'foo')

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}
