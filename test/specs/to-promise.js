/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send} = require('../test-helpers.coffee')

const Promise1 = function(cb) {
  const promise = {type: 1, fulfilled: false, rejected: false}
  cb(
    function(x) {
      promise.fulfilled = true
      return (promise.result = x)
    },
    function(x) {
      promise.rejected = true
      return (promise.result = x)
    }
  )
  return promise
}

const Promise2 = function(cb) {
  const promise = {type: 2, fulfilled: false, rejected: false}
  cb(
    function(x) {
      promise.fulfilled = true
      return (promise.result = x)
    },
    function(x) {
      promise.rejected = true
      return (promise.result = x)
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

describe('toPromise', function() {
  beforeEach(() => _global.Promise = Promise2)
  afterEach(() => _global.Promise = originalGlobalPromise)

  describe('stream', function() {
    it('should return a promise', function() {
      expect(stream().toPromise().type).toBe(2)
      return expect(stream().toPromise(Promise1).type).toBe(1)
    })

    it('should not fulfill/reject if obs ends without value', function() {
      let promise = send(stream(), ['<end>']).toPromise()
      expect(promise.fulfilled || promise.rejected).toBe(false)

      promise = send(stream(), ['<end>']).toPromise(Promise1)
      return expect(promise.fulfilled || promise.rejected).toBe(false)
    })

    it('should fulfill with latest value on end', function() {
      let a = stream()
      let promise = a.toPromise()
      send(a, [1, {error: -1}, 2, '<end>'])
      expect(promise.fulfilled).toBe(true)
      expect(promise.result).toBe(2)

      a = stream()
      promise = a.toPromise(Promise1)
      send(a, [1, 2, '<end>'])
      expect(promise.fulfilled).toBe(true)
      return expect(promise.result).toBe(2)
    })

    it('should reject with latest error on end', function() {
      let a = stream()
      let promise = a.toPromise()
      send(a, [{error: -1}, 1, {error: -2}, '<end>'])
      expect(promise.rejected).toBe(true)
      expect(promise.result).toBe(-2)

      a = stream()
      promise = a.toPromise(Promise1)
      send(a, [{error: -1}, 1, {error: -2}, '<end>'])
      expect(promise.rejected).toBe(true)
      return expect(promise.result).toBe(-2)
    })

    return it('should throw when called without Promise constructor and there is no global promise', function() {
      _global.Promise = undefined
      let error = null
      try {
        stream().toPromise()
      } catch (e) {
        error = e
      }
      return expect(error.message).toBe("There isn't default Promise, use shim or parameter")
    })
  })

  return describe('property', function() {
    it('should handle currents (resolved)', function() {
      let promise = send(prop(), [1, '<end>']).toPromise()
      expect(promise.fulfilled).toBe(true)
      expect(promise.result).toBe(1)

      promise = send(prop(), [1, '<end>']).toPromise(Promise1)
      expect(promise.fulfilled).toBe(true)
      return expect(promise.result).toBe(1)
    })

    return it('should handle currents (rejected)', function() {
      let promise = send(prop(), [{error: -1}, '<end>']).toPromise()
      expect(promise.rejected).toBe(true)
      expect(promise.result).toBe(-1)

      promise = send(prop(), [{error: -1}, '<end>']).toPromise(Promise1)
      expect(promise.rejected).toBe(true)
      return expect(promise.result).toBe(-1)
    })
  })
})
