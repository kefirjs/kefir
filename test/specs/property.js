/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {prop, send, activate, Kefir} = require('../test-helpers.coffee')
const sinon = require('sinon')

describe('Property', function() {
  describe('new', function() {
    it('should create a Property', function() {
      expect(prop()).toBeProperty()
      return expect(new Kefir.Property()).toBeProperty()
    })

    it('should not be ended', () => expect(prop()).toEmit([]))

    return it('should not be active', () => expect(prop()).not.toBeActive())
  })

  describe('end', function() {
    it('should end when `end` sent', function() {
      const s = prop()
      return expect(s).toEmit(['<end>'], () => send(s, ['<end>']))
    })

    it('should call `end` subscribers', function() {
      const s = prop()
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).toEqual([])
      send(s, ['<end>'])
      return expect(log).toEqual([1, 2])
    })

    it('should call `end` subscribers on already ended property', function() {
      const s = prop()
      send(s, ['<end>'])
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      return expect(log).toEqual([1, 2])
    })

    it('should deactivate on end', function() {
      const s = prop()
      activate(s)
      expect(s).toBeActive()
      send(s, ['<end>'])
      return expect(s).not.toBeActive()
    })

    it('should stop deliver new values after end', function() {
      const s = prop()
      return expect(s).toEmit([1, 2, '<end>'], () => send(s, [1, 2, '<end>', 3]))
    })

    it('calling ._emitEnd twice should work fine', function() {
      let err = undefined
      try {
        const s = prop()
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
        const s = prop()
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
      const s = prop()
      s.onValue(function() {})
      return expect(s).toBeActive()
    })

    it('should activate when first subscriber added (error)', function() {
      const s = prop()
      s.onError(function() {})
      return expect(s).toBeActive()
    })

    it('should activate when first subscriber added (end)', function() {
      const s = prop()
      s.onEnd(function() {})
      return expect(s).toBeActive()
    })

    it('should activate when first subscriber added (any)', function() {
      const s = prop()
      s.onAny(function() {})
      return expect(s).toBeActive()
    })

    return it('should deactivate when all subscribers removed', function() {
      let any1, any2, end1, end2, value1, value2
      const s = prop()
      s.onAny((any1 = function() {}))
      s.onAny((any2 = function() {}))
      s.onValue((value1 = function() {}))
      s.onValue((value2 = function() {}))
      s.onEnd((end1 = function() {}))
      s.onEnd((end2 = function() {}))
      s.offValue(value1)
      s.offValue(value2)
      s.offAny(any1)
      s.offAny(any2)
      s.offEnd(end1)
      expect(s).toBeActive()
      s.offEnd(end2)
      return expect(s).not.toBeActive()
    })
  })

  return describe('subscribers', function() {
    it('should deliver values and current', function() {
      const s = send(prop(), [0])
      return expect(s).toEmit([{current: 0}, 1, 2], () => send(s, [1, 2]))
    })

    it('should deliver errors and current error', function() {
      const s = send(prop(), [{error: 0}])
      return expect(s).toEmit([{currentError: 0}, {error: 1}, {error: 2}], () => send(s, [{error: 1}, {error: 2}]))
    })

    it('onValue subscribers should be called with 1 argument', function() {
      const s = send(prop(), [0])
      let count = null
      s.onValue(function() {
        return (count = arguments.length)
      })
      expect(count).toBe(1)
      send(s, [1])
      return expect(count).toBe(1)
    })

    it('onError subscribers should be called with 1 argument', function() {
      const s = send(prop(), [{error: 0}])
      let count = null
      s.onError(function() {
        return (count = arguments.length)
      })
      expect(count).toBe(1)
      send(s, [{error: 1}])
      return expect(count).toBe(1)
    })

    it('onAny subscribers should be called with 1 arguments', function() {
      const s = send(prop(), [0])
      let count = null
      s.onAny(function() {
        return (count = arguments.length)
      })
      expect(count).toBe(1)
      send(s, [1])
      return expect(count).toBe(1)
    })

    it('onEnd subscribers should be called with 0 arguments', function() {
      const s = send(prop(), [0])
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

    it("can't have current value and error at same time", function() {
      const p = send(prop(), [0])
      expect(p).toEmit([{current: 0}])
      send(p, [{error: 1}])
      expect(p).toEmit([{currentError: 1}])
      send(p, [2])
      return expect(p).toEmit([{current: 2}])
    })

    it('should update catched current value before dispatching it', function() {
      const p = send(prop(), [0])
      const spy = sinon.spy()
      p.onValue(function(x) {
        if (x === 1) {
          return p.onValue(spy)
        }
      })
      send(p, [1])
      return expect(spy.args).toEqual([[1]])
    })

    return it('should update catched current error before dispatching it', function() {
      const p = send(prop(), [{error: 0}])
      const spy = sinon.spy()
      p.onError(function(x) {
        if (x === 1) {
          return p.onError(spy)
        }
      })
      send(p, [{error: 1}])
      return expect(spy.args).toEqual([[1]])
    })
  })
})
