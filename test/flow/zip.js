/* @flow */

import Kefir from '../../kefir'

const as = Kefir.sequentially(0, [1, 2, 3, 4])
const bs = Kefir.sequentially(0, ['foo', 'bar', 'baz'])
const cs = Kefir.sequentially(0, [true, false, true])

function test_zip_method_noCombinator() {
  const xs = as.zip(bs)

  xs.onValue((x: [number, string]) => {})

  // $ExpectError
  xs.onValue((x: Array<*>) => {})
}

function test_zip_method_withCombinator() {
  const xs = as.zip(bs, (n, s) => `${n}: ${s}`)

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})
}

function test_zip_noCombinator() {
  const xs = Kefir.zip([as, bs, cs])

  xs.onValue((x: [number, string, boolean]) => {})

  // $ExpectError
  xs.onValue((x: [boolean, string, number]) => {})

  xs.onValue((x: Array<number | string | boolean>) => {})

  // $ExpectError
  xs.onValue((x: Array<number>) => {})
}

function test_zip_withCombinator() {
  const xs = Kefir.zip([as, bs], (n, s) => `${n}: ${s}`)

  xs.onValue((x: string) => {})
}
