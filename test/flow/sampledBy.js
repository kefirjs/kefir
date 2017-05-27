/* @flow */

import Kefir from '../../kefir'

const source = Kefir.sequentially(0, [1, 2, 3, 4])
const samples = Kefir.sequentially(0, ['one', 'one', 'one', 'one'])

function test_sampledBy_noCombinator() {
  const xs = source.sampledBy(samples)

  xs.onValue((x: number) => {})
}

function test_sampledBy_withCombinator() {
  const xs = source.sampledBy(samples, (n: number, s: string) => s)

  // $ExpectError
  source.sampledBy(samples, (s: string, n: number) => s)

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}
