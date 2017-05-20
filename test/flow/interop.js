/* @flow */

import Kefir from '../../kefir'

import EventEmitter from 'events'

class MyEmitter extends EventEmitter {}

function test_fromEvents() {
  const ee = new MyEmitter()
  const xs = Kefir.fromEvents(ee, 'somethingHappened', (x: string, y: number) => 'foo')

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}

function test_toPromise() {
  const xs = Kefir.constant('foo')
  const p = xs.toPromise()

  p.then((x: string) => {})

  // $ExpectError
  p.then((x: number) => {})
}

function test_fromPromise() {
  const p = Promise.resolve('foo')
  const xs = Kefir.fromPromise(p)

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number) => {})
}

function test_fromESObservable() {
  const myObservable = {
    subscribe({next, error, complete}) {
      next && next('foo')
      error && error(new Error())
      complete && complete()
      return {
        unsubscribe() {},
      }
    },
  }

  const xs = Kefir.fromESObservable(myObservable)

  xs.onValue((x: string) => {})

  // $ExpectError
  xs.onValue((x: number) => {})

  xs.onError((e: Error) => {})

  // $ExpectError
  xs.onError((e: number) => {})
}

function test_toESObservable() {
  const xs: Kefir.Observable<string, Error> = Kefir.constant('foo')
  const obs = xs.toESObservable()

  obs.subscribe({
    next: (x: string) => {},
    error: (e: Error) => {},
    complete: () => {},
  })

  obs.subscribe({
    // $ExpectError
    next: (x: number) => {},
    // $ExpectError
    error: (e: number) => {},
    complete: () => {},
  })
}
