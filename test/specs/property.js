const {prop, send, activate, Kefir} = require('../test-helpers')
const sinon = require('sinon')

describe('Property', () => {
  describe('new', () => {
    it('should create a Property', () => {
      expect(prop()).toBeProperty()
      expect(new Kefir.Property()).toBeProperty()
    })

    it('should not be ended', () => {
      expect(prop()).toEmit([])
    })

    it('should not be active', () => {
      expect(prop()).not.toBeActive()
    })
  })

  describe('end', () => {
    it('should end when `end` sent', () => {
      const s = prop()
      expect(s).toEmit(['<end>'], () => send(s, ['<end>']))
    })

    it('should call `end` subscribers', () => {
      const s = prop()
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).toEqual([])
      send(s, ['<end>'])
      expect(log).toEqual([1, 2])
    })

    it('should call `end` subscribers on already ended property', () => {
      const s = prop()
      send(s, ['<end>'])
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).toEqual([1, 2])
    })

    it('should deactivate on end', () => {
      const s = prop()
      activate(s)
      expect(s).toBeActive()
      send(s, ['<end>'])
      expect(s).not.toBeActive()
    })

    it('should stop deliver new values after end', () => {
      const s = prop()
      expect(s).toEmit([1, 2, '<end>'], () => send(s, [1, 2, '<end>', 3]))
    })

    it('calling ._emitEnd twice should work fine', () => {
      let err = undefined
      try {
        const s = prop()
        s._emitEnd()
        s._emitEnd()
      } catch (e) {
        err = e
      }
      expect(err && err.message).toBe(undefined)
    })

    it('calling ._emitEnd in an end handler should work fine', () => {
      let err = undefined
      try {
        const s = prop()
        s.onEnd(() => s._emitEnd())
        s._emitEnd()
      } catch (e) {
        err = e
      }
      expect(err && err.message).toBe(undefined)
    })
  })

  describe('active state', () => {
    it('should activate when first subscriber added (value)', () => {
      const s = prop()
      s.onValue(() => {})
      expect(s).toBeActive()
    })

    it('should activate when first subscriber added (error)', () => {
      const s = prop()
      s.onError(() => {})
      expect(s).toBeActive()
    })

    it('should activate when first subscriber added (end)', () => {
      const s = prop()
      s.onEnd(() => {})
      expect(s).toBeActive()
    })

    it('should activate when first subscriber added (any)', () => {
      const s = prop()
      s.onAny(() => {})
      expect(s).toBeActive()
    })

    it('should deactivate when all subscribers removed', () => {
      let any1, any2, end1, end2, value1, value2
      const s = prop()
      s.onAny((any1 = () => {}))
      s.onAny((any2 = () => {}))
      s.onValue((value1 = () => {}))
      s.onValue((value2 = () => {}))
      s.onEnd((end1 = () => {}))
      s.onEnd((end2 = () => {}))
      s.offValue(value1)
      s.offValue(value2)
      s.offAny(any1)
      s.offAny(any2)
      s.offEnd(end1)
      expect(s).toBeActive()
      s.offEnd(end2)
      expect(s).not.toBeActive()
    })
  })

  describe('subscribers', () => {
    it('should deliver values and current', () => {
      const s = send(prop(), [0])
      expect(s).toEmit([{current: 0}, 1, 2], () => send(s, [1, 2]))
    })

    it('should deliver errors and current error', () => {
      const s = send(prop(), [{error: 0}])
      expect(s).toEmit([{currentError: 0}, {error: 1}, {error: 2}], () => send(s, [{error: 1}, {error: 2}]))
    })

    it('onValue subscribers should be called with 1 argument', () => {
      const s = send(prop(), [0])
      let count = null
      s.onValue(function() {
        return (count = arguments.length)
      })
      expect(count).toBe(1)
      send(s, [1])
      expect(count).toBe(1)
    })

    it('onError subscribers should be called with 1 argument', () => {
      const s = send(prop(), [{error: 0}])
      let count = null
      s.onError(function() {
        return (count = arguments.length)
      })
      expect(count).toBe(1)
      send(s, [{error: 1}])
      expect(count).toBe(1)
    })

    it('onAny subscribers should be called with 1 arguments', () => {
      const s = send(prop(), [0])
      let count = null
      s.onAny(function() {
        return (count = arguments.length)
      })
      expect(count).toBe(1)
      send(s, [1])
      expect(count).toBe(1)
    })

    it('onEnd subscribers should be called with 0 arguments', () => {
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
      expect(count).toBe(0)
    })

    it("can't have current value and error at same time", () => {
      const p = send(prop(), [0])
      expect(p).toEmit([{current: 0}])
      send(p, [{error: 1}])
      expect(p).toEmit([{currentError: 1}])
      send(p, [2])
      expect(p).toEmit([{current: 2}])
    })

    it('should update catched current value before dispatching it', () => {
      const p = send(prop(), [0])
      const spy = sinon.spy()
      p.onValue(x => {
        if (x === 1) {
          return p.onValue(spy)
        }
      })
      send(p, [1])
      expect(spy.args).toEqual([[1]])
    })

    it('should update catched current error before dispatching it', () => {
      const p = send(prop(), [{error: 0}])
      const spy = sinon.spy()
      p.onError(x => {
        if (x === 1) {
          return p.onError(spy)
        }
      })
      send(p, [{error: 1}])
      expect(spy.args).toEqual([[1]])
    })
  })
})
