Observable = require('zen-observable')
Rx = require('@reactivex/rxjs')
{activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe 'fromESObservable', ->
  it 'turns an ES7 observable into a stream', ->
    expect(Kefir.fromESObservable(Observable.of(1, 2))).toBeStream()

  it 'emits events from observable to stream', (done) ->
    stream = Kefir.fromESObservable(Observable.of(1, 2))
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
    Kefir.fromESObservable(observable).onEnd -> done()

  it 'turns an RxJS observable into a Kefir stream', (done) ->
    stream = Kefir.fromESObservable(Rx.Observable.of('hello world'))
    values = []
    stream.onValue (value) -> values.push(value)
    stream.onEnd ->
      expect(values).toEqual(['hello world'])
      done()
