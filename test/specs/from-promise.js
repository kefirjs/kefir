const {activate, deactivate, value, error, end, Kefir, expect} = require('../test-helpers')

describe('fromPromise', () => {
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

  it('should return property', () => {
    expect(Kefir.fromPromise(inProgress)).to.be.observable.property()
  })

  it('should call `property.then` on first activation, and only on first', () => {
    let count = 0
    const s = Kefir.fromPromise({
      then() {
        return count++
      },
    })
    expect(count).to.equal(0)
    activate(s)
    expect(count).to.equal(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    expect(count).to.equal(1)
  })

  it('should call `property.done`', () => {
    let count = 0
    const s = Kefir.fromPromise({
      then() {
        return this
      },
      done() {
        return count++
      },
    })
    expect(count).to.equal(0)
    activate(s)
    expect(count).to.equal(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    expect(count).to.equal(1)
  })

  it('should work correctly with inProgress property', () => {
    expect(Kefir.fromPromise(inProgress)).to.emitInTime([])
  })

  it('... with fulfilledSync property', () => {
    expect(Kefir.fromPromise(fulfilledSync)).to.emit([value(1, {current: true}), end({current: true})])
  })

  it('... with failedSync property', () =>
    expect(Kefir.fromPromise(failedSync)).to.emit([error(1, {current: true}), end({current: true})]))

  it('... with fulfilledAsync property', () => {
    const a = Kefir.fromPromise(fulfilledAsync)
    expect(a).to.emitInTime([
      [1000, value(1)],
      [1000, end()],
    ])
    expect(a).to.emit([value(1, {current: true}), end({current: true})])
  })

  it('... with failedAsync property', () => {
    const a = Kefir.fromPromise(failedAsync)
    expect(a).to.emitInTime([
      [1000, error(1)],
      [1000, end()],
    ])
    expect(a).to.emit([error(1, {current: true}), end({current: true})])
  })
})
