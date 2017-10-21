/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $$observable = require('symbol-observable').default
const Observable = require('zen-observable')
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

describe('[Symbol.observable]', function() {
  it('outputs a compatible Observable', function(done) {
    const a = stream()
    const values = []
    const observable = Observable.from(a)
    observable.subscribe({
      next(x) {
        return values.push(x)
      },
      complete(x) {
        expect(values).toEqual([1, 2, 3])
        return done()
      },
    })
    return send(a, [1, 2, 3, '<end>'])
  })

  it('unsubscribes stream after an error', function() {
    const a = stream()
    const values = []
    const observable = a[$$observable]()
    observable.subscribe({
      next(x) {
        return values.push(x)
      },
    })
    send(a, [1, {error: 2}, 3])
    return expect(values).toEqual([1])
  })

  it('subscribe() returns an subscribtion object with unsubscribe method', function() {
    const a = stream()
    const values = []
    const observable = a[$$observable]()
    const subscribtion = observable.subscribe({
      next(x) {
        return values.push(x)
      },
    })
    send(a, [1])
    subscribtion.unsubscribe()
    send(a, [2])
    return expect(values).toEqual([1])
  })

  it('subscribtion object has `closed` property', function() {
    const a = stream()
    const observable = a[$$observable]()
    const subscribtion = observable.subscribe({next() {}})
    expect(subscribtion.closed).toEqual(false)
    subscribtion.unsubscribe()
    return expect(subscribtion.closed).toEqual(true)
  })

  it('supports subscribe(onNext, onError, onCompete) format', function() {
    const a = stream()
    const values = []
    const errors = []
    const completes = []
    const onValue = x => values.push(x)
    const onError = x => errors.push(x)
    const onComplete = x => completes.push(x)
    const observable = a[$$observable]()
    observable.subscribe(onValue, onError, onComplete)
    send(a, [1, {error: 2}])
    expect(values).toEqual([1])
    expect(errors).toEqual([2])
    return expect(completes).toEqual([undefined])
  })

  return it('closed=true after end', function() {
    const a = stream()
    const observable = a[$$observable]()
    const subscribtion = observable.subscribe(function() {})
    expect(subscribtion.closed).toEqual(false)
    send(a, ['<end>'])
    return expect(subscribtion.closed).toEqual(true)
  })
})
