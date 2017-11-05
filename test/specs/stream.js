const {stream, send, value, error, end, activate, Kefir, expect} = require('../test-helpers')

describe('Stream', () => {
  describe('new', () => {
    it('should create a Stream', () => {
      expect(stream()).to.be.observable.stream()
      expect(new Kefir.Stream()).to.be.observable.stream()
    })

    it('should not be ended', () => {
      expect(stream()).to.emit([])
    })

    it('should not be active', () => {
      expect(stream()).not.to.be.active()
    })
  })

  describe('end', () => {
    it('should end when `end` sent', () => {
      const s = stream()
      expect(s).to.emit([end()], () => send(s, [end()]))
    })

    it('should call `end` subscribers', () => {
      const s = stream()
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).to.deep.equal([])
      send(s, [end()])
      expect(log).to.deep.equal([1, 2])
    })

    it('should call `end` subscribers on already ended stream', () => {
      const s = stream()
      send(s, [end()])
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).to.deep.equal([1, 2])
    })

    it('should deactivate on end', () => {
      const s = stream()
      activate(s)
      expect(s).to.be.active()
      send(s, [end()])
      expect(s).not.to.be.active()
    })

    it('should stop deliver new values after end', () => {
      const s = stream()
      expect(s).to.emit([value(1), value(2), end()], () => send(s, [value(1), value(2), end(), value(3)]))
    })

    it('calling ._emitEnd twice should work fine', () => {
      let err = undefined
      try {
        const s = stream()
        s._emitEnd()
        s._emitEnd()
      } catch (e) {
        err = e
      }
      expect(err && err.message).to.equal(undefined)
    })

    it('calling ._emitEnd in an end handler should work fine', () => {
      let err = undefined
      try {
        const s = stream()
        s.onEnd(() => s._emitEnd())
        s._emitEnd()
      } catch (e) {
        err = e
      }
      expect(err && err.message).to.equal(undefined)
    })
  })

  describe('active state', () => {
    it('should activate when first subscriber added (value)', () => {
      const s = stream()
      s.onValue(() => {})
      expect(s).to.be.active()
    })

    it('should activate when first subscriber added (error)', () => {
      const s = stream()
      s.onError(() => {})
      expect(s).to.be.active()
    })

    it('should activate when first subscriber added (end)', () => {
      const s = stream()
      s.onEnd(() => {})
      expect(s).to.be.active()
    })

    it('should activate when first subscriber added (any)', () => {
      const s = stream()
      s.onAny(() => {})
      expect(s).to.be.active()
    })

    it('should deactivate when all subscribers removed', () => {
      let any1, any2, end1, end2, error1, error2, value1, value2
      const s = stream()
      s.onAny((any1 = () => {}))
      s.onAny((any2 = () => {}))
      s.onValue((value1 = () => {}))
      s.onValue((value2 = () => {}))
      s.onError((error1 = () => {}))
      s.onError((error2 = () => {}))
      s.onEnd((end1 = () => {}))
      s.onEnd((end2 = () => {}))
      s.offValue(value1)
      s.offValue(value2)
      s.offError(error1)
      s.offError(error2)
      s.offAny(any1)
      s.offAny(any2)
      s.offEnd(end1)
      expect(s).to.be.active()
      s.offEnd(end2)
      expect(s).not.to.be.active()
    })
  })

  describe('subscribers', () => {
    it('should deliver values', () => {
      const s = stream()
      expect(s).to.emit([value(1), value(2)], () => send(s, [value(1), value(2)]))
    })

    it('should deliver errors', () => {
      const s = stream()
      expect(s).to.emit([error(1), error(2)], () => send(s, [error(1), error(2)]))
    })

    it('should not deliver values to unsubscribed subscribers', () => {
      const log = []
      const a = x => log.push(`a${x}`)
      const b = x => log.push(`b${x}`)
      const s = stream()
      s.onValue(a)
      s.onValue(b)
      send(s, [value(1)])
      s.offValue(() => {})
      send(s, [value(2)])
      s.offValue(a)
      send(s, [value(3)])
      s.offValue(b)
      send(s, [value(4)])
      expect(log).to.deep.equal(['a1', 'b1', 'a2', 'b2', 'b3'])
    })

    it('should not deliver errors to unsubscribed subscribers', () => {
      const log = []
      const a = x => log.push(`a${x}`)
      const b = x => log.push(`b${x}`)
      const s = stream()
      s.onError(a)
      s.onError(b)
      send(s, [error(1)])
      s.offError(() => {})
      send(s, [error(2)])
      s.offError(a)
      send(s, [error(3)])
      s.offError(b)
      send(s, [error(4)])
      expect(log).to.deep.equal(['a1', 'b1', 'a2', 'b2', 'b3'])
    })

    it('onValue subscribers should be called with 1 argument', () => {
      const s = stream()
      let count = null
      s.onValue(function() {
        return (count = arguments.length)
      })
      send(s, [value(1)])
      expect(count).to.equal(1)
    })

    it('onError subscribers should be called with 1 argument', () => {
      const s = stream()
      let count = null
      s.onError(function() {
        return (count = arguments.length)
      })
      send(s, [error(1)])
      expect(count).to.equal(1)
    })

    it('onAny subscribers should be called with 1 arguments', () => {
      const s = stream()
      let count = null
      s.onAny(function() {
        return (count = arguments.length)
      })
      send(s, [value(1)])
      expect(count).to.equal(1)
    })

    it('onEnd subscribers should be called with 0 arguments', () => {
      const s = stream()
      let count = null
      s.onEnd(function() {
        return (count = arguments.length)
      })
      send(s, [end()])
      expect(count).to.equal(0)
      s.onEnd(function() {
        return (count = arguments.length)
      })
      expect(count).to.equal(0)
    })

    it('should not call subscriber after unsubscribing (from another subscriber)', () => {
      const log = []
      const a = () => log.push('a')
      const b = () => {
        s.offValue(a)
        return log.push('unsub a')
      }
      var s = stream()
      s.onValue(b)
      s.onValue(a)
      send(s, [value(1)])
      expect(log).to.deep.equal(['unsub a'])
    })

    it('should not call subscribers after end (fired from another subscriber)', () => {
      const log = []
      const a = () => log.push('a')
      const b = () => {
        send(s, [end()])
        return log.push('end fired')
      }
      var s = stream()
      s.onValue(b)
      s.onValue(a)
      send(s, [value(1)])
      expect(log).to.deep.equal(['end fired'])
    })
  })
})
