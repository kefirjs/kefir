{activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe 'fromPromise', ->

  inProgress = {
    then: ->
  }

  fulfilledSync = {
    then: (onSuccess) ->
      onSuccess(1)
  }

  failedSync = {
    then: (onSuccess, onError) ->
      onError(1)
  }

  fulfilledAsync = {
    then: (onSuccess) ->
      fulfill = -> onSuccess(1)
      setTimeout(fulfill, 1000)
  }

  failedAsync = {
    then: (onSuccess, onError) ->
      fail = -> onError(1)
      setTimeout(fail, 1000)
  }


  it 'should return property', ->
    expect(Kefir.fromPromise(inProgress)).toBeProperty()

  it 'should call `property.then` on first activation, and only on first', ->
    count = 0
    s = Kefir.fromPromise {then: -> count++}
    expect(count).toBe(0)
    activate(s)
    expect(count).toBe(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    expect(count).toBe(1)

  it 'should call `property.done`', ->
    count = 0
    s = Kefir.fromPromise {then: (-> this), done: (-> count++)}
    expect(count).toBe(0)
    activate(s)
    expect(count).toBe(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    expect(count).toBe(1)

  it 'should work correctly with inProgress property', ->
    expect(Kefir.fromPromise(inProgress)).toEmitInTime []

  it '... with fulfilledSync property', ->
    expect(Kefir.fromPromise(fulfilledSync)).toEmit [{ current : 1 }, '<end:current>']

  it '... with failedSync property', ->
    expect(Kefir.fromPromise(failedSync)).toEmit [{ currentError : 1 }, '<end:current>']

  it '... with fulfilledAsync property', ->
    a = Kefir.fromPromise(fulfilledAsync)
    expect(a).toEmitInTime [[ 1000, 1 ], [ 1000, '<end>' ]]
    expect(a).toEmit [{ current : 1 }, '<end:current>']

  it '... with failedAsync property', ->
    a = Kefir.fromPromise(failedAsync)
    expect(a).toEmitInTime [[ 1000, {error: 1} ], [ 1000, '<end>' ]]
    expect(a).toEmit [{ currentError : 1 }, '<end:current>']
