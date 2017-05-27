/*
 * Some observables are guaranteed not to emit values or errors. For example,
 * `Kefir.constant(x)` produces an observable that never emits errors. In those
 * cases Kefir's type definitions use `empty` as a type parameter.
 *
 * @flow
 */

import Kefir from '../../kefir'

function test_Constant() {
  const c = Kefir.constant('foo')

  c.onValue((x: string) => {})

  // $ExpectError
  c.onValue((x: number) => {})

  // Error callbacks accept any argument type
  c.onError((e: Error) => {})
}

function testConstantError() {
  const c = Kefir.constantError(new Error('foo'))

  // Value callbacks accept any argument type
  c.onValue((x: string) => {})
  c.onValue((x: number) => {})

  c.onError((e: Error) => {})

  // $ExpectError
  c.onError((e: string) => {})
}

function testNever() {
  const never = Kefir.never()

  // Value and error callbacks accept any argument types
  never.onValue((x: string) => {})
  never.onValue((x: number) => {})
  never.onError((e: Error) => {})

  const merged = never.merge(Kefir.constant('foo'))

  merged.onValue((x: string) => {})

  // $ExpectError - the merged observable has `string` values, value callbacks must accept `string` arguments
  merged.onValue((x: number) => {})

  merged.onError((e: Error) => {})
}
