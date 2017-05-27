/* @flow */

import Kefir from '../../kefir'

const source = Kefir.sequentially(10, [1, 2, 3, 4])

function test_diff_noArgs() {
  const xs = source.diff()

  xs.onValue((x: [number, number]) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}

function test_diff_fn() {
  const xs = source.diff((x, y) => x - y)

  xs.onValue((x: number) => {})

  // $ExpectError
  xs.onValue((x: [number, number]) => {})
}

function test_diff_fnAndSeed() {
  const xs = source.diff((x, y) => x - y, 0)

  // $ExpectError
  source.diff((x, y) => x - y, 'zero')

  xs.onValue((x: number) => {})

  // $ExpectError
  xs.onValue((x: [number, number]) => {})
}

function test_diff_seed() {
  const xs = source.diff(null, 'zero')

  xs.onValue((x: [number | string, number]) => {})

  // $ExpectError
  xs.onValue((x: [number, number]) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}
