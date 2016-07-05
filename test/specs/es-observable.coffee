$$observable = require('symbol-observable').default
Observable = require('zen-observable')
{stream, prop, send, Kefir} = require('../test-helpers.coffee')


describe '[Symbol.observable]', ->

  it 'outputs a compatible Observable', (done) ->
    a = stream()
    values = []
    observable = Observable.from(a)
    observable.subscribe
      next: (x) ->
        values.push(x)
      complete: (x) ->
        expect(values).toEqual([1, 2, 3])
        done()
    send(a, [1, 2, 3, '<end>'])

  it 'unsubscribes stream after an error', ->
    a = stream()
    values = []
    observable = a[$$observable]()
    observable.subscribe(next: (x) -> values.push(x))
    send(a, [1, {error: 2}, 3])
    expect(values).toEqual([1])

  it 'subscribe() returns an subscribtion object with unsubscribe method', ->
    a = stream()
    values = []
    observable = a[$$observable]()
    subscribtion = observable.subscribe(next: (x) -> values.push(x))
    send(a, [1])
    subscribtion.unsubscribe()
    send(a, [2])
    expect(values).toEqual([1])

  it 'subscribtion object has `closed` property', ->
    a = stream()
    observable = a[$$observable]()
    subscribtion = observable.subscribe(next: ->)
    expect(subscribtion.closed).toEqual(false)
    subscribtion.unsubscribe()
    expect(subscribtion.closed).toEqual(true)

  it 'supports subscribe(onNext, onError, onCompete) format', ->
    a = stream()
    values = []
    errors = []
    completes = []
    onValue = (x) -> values.push(x)
    onError = (x) -> errors.push(x)
    onComplete = (x) -> completes.push(x)
    observable = a[$$observable]()
    observable.subscribe(onValue, onError, onComplete)
    send(a, [1, {error: 2}])
    expect(values).toEqual([1])
    expect(errors).toEqual([2])
    expect(completes).toEqual([undefined])



