const $$observable = require('symbol-observable').default
const Observable = require('zen-observable')
const {stream, send, expect} = require('../test-helpers')

describe('[Symbol.observable]', () => {
  it('outputs a compatible Observable', done => {
    const a = stream()
    const values = []
    const observable = Observable.from(a)
    observable.subscribe({
      next(x) {
        values.push(x)
      },
      complete(x) {
        expect(values).to.deep.equal([1, 2, 3])
        done()
      },
    })
    send(a, [1, 2, 3, '<end>'])
  })

  it('unsubscribes stream after an error', () => {
    const a = stream()
    const values = []
    const observable = a[$$observable]()
    observable.subscribe({
      next(x) {
        values.push(x)
      },
    })
    send(a, [1, {error: 2}, 3])
    expect(values).to.deep.equal([1])
  })

  it('subscribe() returns an subscribtion object with unsubscribe method', () => {
    const a = stream()
    const values = []
    const observable = a[$$observable]()
    const subscribtion = observable.subscribe({
      next(x) {
        values.push(x)
      },
    })
    send(a, [1])
    subscribtion.unsubscribe()
    send(a, [2])
    expect(values).to.deep.equal([1])
  })

  it('subscribtion object has `closed` property', () => {
    const a = stream()
    const observable = a[$$observable]()
    const subscribtion = observable.subscribe({next() {}})
    expect(subscribtion.closed).to.deep.equal(false)
    subscribtion.unsubscribe()
    expect(subscribtion.closed).to.deep.equal(true)
  })

  it('supports subscribe(onNext, onError, onCompete) format', () => {
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
    expect(values).to.deep.equal([1])
    expect(errors).to.deep.equal([2])
    expect(completes).to.deep.equal([undefined])
  })

  it('closed=true after end', () => {
    const a = stream()
    const observable = a[$$observable]()
    const subscribtion = observable.subscribe(() => {})
    expect(subscribtion.closed).to.deep.equal(false)
    send(a, ['<end>'])
    expect(subscribtion.closed).to.deep.equal(true)
  })
})
