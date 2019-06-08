const Observable = require('zen-observable')
const {of: observableOf} = require('rxjs')
const {activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('fromESObservable', () => {
  it('turns an ES7 observable into a stream', () => {
    expect(Kefir.fromESObservable(Observable.of(1, 2))).to.be.observable.stream()
  })

  it('emits events from observable to stream', done => {
    const stream = Kefir.fromESObservable(Observable.of(1, 2))
    const values = []
    stream.onValue(value => values.push(value))
    return stream.onEnd(() => {
      expect(values).to.deep.equal([1, 2])
      return done()
    })
  })

  it('ends stream after an error', done => {
    const observable = new Observable(observer => {
      observer.next(1)
      return observer.error()
    })
    return Kefir.fromESObservable(observable).onEnd(() => done())
  })

  it('turns an RxJS observable into a Kefir stream', done => {
    const stream = Kefir.fromESObservable(observableOf('hello world'))
    const values = []
    stream.onValue(value => values.push(value))
    return stream.onEnd(() => {
      expect(values).to.deep.equal(['hello world'])
      return done()
    })
  })
})
