/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, send, activate, Kefir} = require('../test-helpers')

describe('Stream', function() {
  describe('new', function() {
    it('should create a Stream', function() {
      expect(stream()).toBeStream()
      return expect(new Kefir.Stream()).toBeStream()
    })

    it('should not be ended', () => expect(stream()).toEmit([]))

    return it('should not be active', () => expect(stream()).not.toBeActive())
  })

  describe('end', function() {
    it('should end when `end` sent', function() {
      const s = stream()
      return expect(s).toEmit(['<end>'], () => send(s, ['<end>']))
    })

    it('should call `end` subscribers', function() {
      const s = stream()
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).toEqual([])
      send(s, ['<end>'])
      return expect(log).toEqual([1, 2])
    })

    it('should call `end` subscribers on already ended stream', function() {
      const s = stream()
      send(s, ['<end>'])
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      return expect(log).toEqual([1, 2])
    })

    it('should deactivate on end', function() {
      const s = stream()
      activate(s)
      expect(s).toBeActive()
      send(s, ['<end>'])
      return expect(s).not.toBeActive()
    })

    it('should stop deliver new values after end', function() {
      const s = stream()
      return expect(s).toEmit([1, 2, '<end>'], () => send(s, [1, 2, '<end>', 3]))
    })

    it('calling ._emitEnd twice should work fine', function() {
      let err = undefined
      try {
        const s = stream()
        s._emitEnd()
        s._emitEnd()
      } catch (e) {
        err = e
      }
      return expect(err && err.message).toBe(undefined)
    })

    return it('calling ._emitEnd in an end handler should work fine', function() {
      let err = undefined
      try {
        const s = stream()
        s.onEnd(() => s._emitEnd())
        s._emitEnd()
      } catch (e) {
        err = e
      }
      return expect(err && err.message).toBe(undefined)
    })
  })

  describe('active state', function() {
    it('should activate when first subscriber added (value)', function() {
      const s = stream()
      s.onValue(function() {})
      return expect(s).toBeActive()
    })

    it('should activate when first subscriber added (error)', function() {
      const s = stream()
      s.onError(function() {})
      return expect(s).toBeActive()
    })

    it('should activate when first subscriber added (end)', function() {
      const s = stream()
      s.onEnd(function() {})
      return expect(s).toBeActive()
    })

    it('should activate when first subscriber added (any)', function() {
      const s = stream()
      s.onAny(function() {})
      return expect(s).toBeActive()
    })

    return it('should deactivate when all subscribers removed', function() {
      let any1, any2, end1, end2, error1, error2, value1, value2
      const s = stream()
      s.onAny((any1 = function() {}))
      s.onAny((any2 = function() {}))
      s.onValue((value1 = function() {}))
      s.onValue((value2 = function() {}))
      s.onError((error1 = function() {}))
      s.onError((error2 = function() {}))
      s.onEnd((end1 = function() {}))
      s.onEnd((end2 = function() {}))
      s.offValue(value1)
      s.offValue(value2)
      s.offError(error1)
      s.offError(error2)
      s.offAny(any1)
      s.offAny(any2)
      s.offEnd(end1)
      expect(s).toBeActive()
      s.offEnd(end2)
      return expect(s).not.toBeActive()
    })
  })

  return describe('subscribers', function() {
    it('should deliver values', function() {
      const s = stream()
      return expect(s).toEmit([1, 2], () => send(s, [1, 2]))
    })

    it('should deliver errors', function() {
      const s = stream()
      return expect(s).toEmit([{error: 1}, {error: 2}], () => send(s, [{error: 1}, {error: 2}]))
    })

    it('should not deliver values to unsubscribed subscribers', function() {
      const log = []
      const a = x => log.push(`a${x}`)
      const b = x => log.push(`b${x}`)
      const s = stream()
      s.onValue(a)
      s.onValue(b)
      send(s, [1])
      s.offValue(function() {})
      send(s, [2])
      s.offValue(a)
      send(s, [3])
      s.offValue(b)
      send(s, [4])
      return expect(log).toEqual(['a1', 'b1', 'a2', 'b2', 'b3'])
    })

    it('should not deliver errors to unsubscribed subscribers', function() {
      const log = []
      const a = x => log.push(`a${x}`)
      const b = x => log.push(`b${x}`)
      const s = stream()
      s.onError(a)
      s.onError(b)
      send(s, [{error: 1}])
      s.offError(function() {})
      send(s, [{error: 2}])
      s.offError(a)
      send(s, [{error: 3}])
      s.offError(b)
      send(s, [{error: 4}])
      return expect(log).toEqual(['a1', 'b1', 'a2', 'b2', 'b3'])
    })

    it('onValue subscribers should be called with 1 argument', function() {
      const s = stream()
      let count = null
      s.onValue(function() {
        return (count = arguments.length)
      })
      send(s, [1])
      return expect(count).toBe(1)
    })

    it('onError subscribers should be called with 1 argument', function() {
      const s = stream()
      let count = null
      s.onError(function() {
        return (count = arguments.length)
      })
      send(s, [{error: 1}])
      return expect(count).toBe(1)
    })

    it('onAny subscribers should be called with 1 arguments', function() {
      const s = stream()
      let count = null
      s.onAny(function() {
        return (count = arguments.length)
      })
      send(s, [1])
      return expect(count).toBe(1)
    })

    it('onEnd subscribers should be called with 0 arguments', function() {
      const s = stream()
      let count = null
      s.onEnd(function() {
        return (count = arguments.length)
      })
      send(s, ['<end>'])
      expect(count).toBe(0)
      s.onEnd(function() {
        return (count = arguments.length)
      })
      return expect(count).toBe(0)
    })

    it('should not call subscriber after unsubscribing (from another subscriber)', function() {
      const log = []
      const a = () => log.push('a')
      const b = function() {
        s.offValue(a)
        return log.push('unsub a')
      }
      var s = stream()
      s.onValue(b)
      s.onValue(a)
      send(s, [1])
      return expect(log).toEqual(['unsub a'])
    })

    return it('should not call subscribers after end (fired from another subscriber)', function() {
      const log = []
      const a = () => log.push('a')
      const b = function() {
        send(s, ['<end>'])
        return log.push('end fired')
      }
      var s = stream()
      s.onValue(b)
      s.onValue(a)
      send(s, [1])
      return expect(log).toEqual(['end fired'])
    })
  })
})
