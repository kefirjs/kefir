/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe('fromPromise', function() {
  const inProgress = {
    then() {},
  }

  const fulfilledSync = {
    then(onSuccess) {
      return onSuccess(1)
    },
  }

  const failedSync = {
    then(onSuccess, onError) {
      return onError(1)
    },
  }

  const fulfilledAsync = {
    then(onSuccess) {
      const fulfill = () => onSuccess(1)
      return setTimeout(fulfill, 1000)
    },
  }

  const failedAsync = {
    then(onSuccess, onError) {
      const fail = () => onError(1)
      return setTimeout(fail, 1000)
    },
  }

  it('should return property', () => expect(Kefir.fromPromise(inProgress)).toBeProperty())

  it('should call `property.then` on first activation, and only on first', function() {
    let count = 0
    const s = Kefir.fromPromise({
      then() {
        return count++
      },
    })
    expect(count).toBe(0)
    activate(s)
    expect(count).toBe(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    return expect(count).toBe(1)
  })

  it('should call `property.done`', function() {
    let count = 0
    const s = Kefir.fromPromise({
      then() {
        return this
      },
      done() {
        return count++
      },
    })
    expect(count).toBe(0)
    activate(s)
    expect(count).toBe(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    return expect(count).toBe(1)
  })

  it('should work correctly with inProgress property', () => expect(Kefir.fromPromise(inProgress)).toEmitInTime([]))

  it('... with fulfilledSync property', () =>
    expect(Kefir.fromPromise(fulfilledSync)).toEmit([{current: 1}, '<end:current>']))

  it('... with failedSync property', () =>
    expect(Kefir.fromPromise(failedSync)).toEmit([{currentError: 1}, '<end:current>']))

  it('... with fulfilledAsync property', function() {
    const a = Kefir.fromPromise(fulfilledAsync)
    expect(a).toEmitInTime([[1000, 1], [1000, '<end>']])
    return expect(a).toEmit([{current: 1}, '<end:current>'])
  })

  return it('... with failedAsync property', function() {
    const a = Kefir.fromPromise(failedAsync)
    expect(a).toEmitInTime([[1000, {error: 1}], [1000, '<end>']])
    return expect(a).toEmit([{currentError: 1}, '<end:current>'])
  })
})
