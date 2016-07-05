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

