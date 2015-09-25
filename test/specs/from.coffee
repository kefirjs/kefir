Observable = require('zen-observable')
Rx = require('@reactivex/rxjs')
{activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe 'from', ->
  it 'turns an ES7 observable into a stream', ->
    expect(Kefir.from(Observable.of(1, 2))).toBeStream()

  it 'emits events from observable to stream', (done) ->
    stream = Kefir.from(Observable.of(1, 2))
    values = []
    stream.onValue (value) -> values.push(value)
    stream.onEnd ->
      expect(values).toEqual([1, 2])
      done()

  it 'ends stream after an error', (done) ->
    observable = new Observable((observer) ->
      observer.next(1)
      observer.error()
    )
    Kefir.from(observable).onEnd -> done()

  it 'turns an RxJS observable into a Kefir stream', (done) ->
    stream = Kefir.from(Rx.Observable.of('hello world'))
    values = []
    stream.onValue (value) -> values.push(value)
    stream.onEnd ->
      expect(values).toEqual(['hello world'])
      done()
