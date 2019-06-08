/* @flow */

import Kefir from '../../kefir'

const numbers = Kefir.sequentially(0, [1, 2, 3, 4])
const strings = Kefir.sequentially(0, ['foo', 'bar', 'baz'])
const functions = Kefir.sequentially(0, [(n: number) => 'foobar'])

function test_combine_method() {
  const xs = numbers.combine(strings)

  xs.onValue((x: [number, string]) => {})

  // $ExpectError
  xs.onValue((x: number | string) => {})
}

function test_combine_method_withCombinator() {
  const xs = numbers.combine(strings, (n, s) => `${n}: ${s}`)

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}

function test_combine_method_withCombinatorAndPassive() {
  const xs = numbers.combine(strings, [functions], (n, s, f) => f(n) + s)

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}

function test_combine_method_withPassive() {
  const xs = numbers.combine(strings, [functions])

  xs.onValue((x: (number | string | Function)[]) => {})

  // $ExpectError
  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number | string | Function) => {})
}

function test_combine() {
  const xs = Kefir.combine([numbers, strings])

  xs.onValue((x: (number | string)[]) => {})

  // $ExpectError
  xs.onValue((x: number | string) => {})
}

function test_combine_withCombinator() {
  const xs = Kefir.combine([numbers, strings], (n, s) => `${n}: ${s}`)

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}

function test_combine_withCombinatorAndPassive() {
  const xs = Kefir.combine([numbers, strings], [functions], (n, s, f) => 'foo')

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}

function test_combine_withPassive() {
  const xs = Kefir.combine([numbers, strings], [functions])

  xs.onValue((x: (number | string | Function)[]) => {})

  // $ExpectError
  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number | string | Function) => {})
}

function test_combine_object() {
  const xs = Kefir.combine({numbers, strings})

  xs.onValue((x: {numbers: number, strings: string}) => {})

  // $ExpectError
  xs.onValue((x: {numbers: string, strings: string}) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})
}

function test_combine_object_withCombinator() {
  const xs = Kefir.combine(
    {numbers, strings},
    (args: {numbers: number, strings: string}) => `${args.numbers}: ${args.strings}`
  )

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: {numbers: number, strings: string}) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})
}

function test_combine_object_withCombinatorAndPassive() {
  const xs = Kefir.combine(
    {numbers, strings},
    {functions},
    (args: {numbers: number, strings: string, functions: (n: number) => string}) => {
      return args.functions(args.numbers) + args.strings
    }
  )

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: {numbers: number, strings: string}) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})
}

function test_combine_object_withPassive() {
  const xs = Kefir.combine({numbers, strings}, {functions})

  xs.onValue((x: {numbers: number, strings: string, functions: (n: number) => string}) => {})

  // $ExpectError
  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: [number, string]) => {})
}
