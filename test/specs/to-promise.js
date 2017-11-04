const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

function Promise1(cb) {
  const promise = {type: 1, fulfilled: false, rejected: false}
  cb(
    x => {
      promise.fulfilled = true
      promise.result = x
    },
    x => {
      promise.rejected = true
      promise.result = x
    }
  )
  return promise
}

function Promise2(cb) {
  const promise = {type: 2, fulfilled: false, rejected: false}
  cb(
    x => {
      promise.fulfilled = true
      promise.result = x
    },
    x => {
      promise.rejected = true
      promise.result = x
    }
  )
  return promise
}

let _global = null
if (typeof global !== 'undefined') {
  _global = global
}
if (typeof self !== 'undefined') {
  _global = self
}

const originalGlobalPromise = _global.Promise

describe('toPromise', () => {
  beforeEach(() => {
    _global.Promise = Promise2
  })
  afterEach(() => {
    _global.Promise = originalGlobalPromise
  })

  describe('stream', () => {
    it('should return a promise', () => {
      expect(stream().toPromise().type).to.equal(2)
      expect(stream().toPromise(Promise1).type).to.equal(1)
    })

    it('should not fulfill/reject if obs ends without value', () => {
      let promise = send(stream(), [end()]).toPromise()
      expect(promise.fulfilled || promise.rejected).to.equal(false)

      promise = send(stream(), [end()]).toPromise(Promise1)
      expect(promise.fulfilled || promise.rejected).to.equal(false)
    })

    it('should fulfill with latest value on end', () => {
      let a = stream()
      let promise = a.toPromise()
      send(a, [value(1), error(-1, {current: true}), value(2), end()])
      expect(promise.fulfilled).to.equal(true)
      expect(promise.result).to.equal(2)

      a = stream()
      promise = a.toPromise(Promise1)
      send(a, [value(1), value(2), end()])
      expect(promise.fulfilled).to.equal(true)
      expect(promise.result).to.equal(2)
    })

    it('should reject with latest error on end', () => {
      let a = stream()
      let promise = a.toPromise()
      send(a, [error(-1, {current: true}), value(1), error(-2), end()])
      expect(promise.rejected).to.equal(true)
      expect(promise.result).to.equal(-2)

      a = stream()
      promise = a.toPromise(Promise1)
      send(a, [error(-1, {current: true}), value(1), error(-2), end()])
      expect(promise.rejected).to.equal(true)
      expect(promise.result).to.equal(-2)
    })

    it('should throw when called without Promise constructor and there is no global promise', () => {
      _global.Promise = undefined
      let error = null
      try {
        stream().toPromise()
      } catch (e) {
        error = e
      }
      expect(error.message).to.equal("There isn't default Promise, use shim or parameter")
    })
  })

  describe('property', () => {
    it('should handle currents (resolved)', () => {
      let promise = send(prop(), [value(1), end()]).toPromise()
      expect(promise.fulfilled).to.equal(true)
      expect(promise.result).to.equal(1)

      promise = send(prop(), [value(1), end()]).toPromise(Promise1)
      expect(promise.fulfilled).to.equal(true)
      expect(promise.result).to.equal(1)
    })

    it('should handle currents (rejected)', () => {
      let promise = send(prop(), [error(-1, {current: true}), end()]).toPromise()
      expect(promise.rejected).to.equal(true)
      expect(promise.result).to.equal(-1)

      promise = send(prop(), [error(-1, {current: true}), end()]).toPromise(Promise1)
      expect(promise.rejected).to.equal(true)
      expect(promise.result).to.equal(-1)
    })
  })
})
