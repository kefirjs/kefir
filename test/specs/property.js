const {prop, send, value, error, end, activate, Kefir, expect} = require('../test-helpers')
const sinon = require('sinon')

describe('Property', () => {
  describe('new', () => {
    it('should create a Property', () => {
      expect(prop()).to.be.observable.property()
      expect(new Kefir.Property()).to.be.observable.property()
    })

    it('should not be ended', () => {
      expect(prop()).to.emit([])
    })

    it('should not be active', () => {
      expect(prop()).not.to.be.active()
    })
  })

  describe('end', () => {
    it('should end when `end` sent', () => {
      const s = prop()
      expect(s).to.emit([end()], () => send(s, [end()]))
    })

    it('should call `end` subscribers', () => {
      const s = prop()
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).to.deep.equal([])
      send(s, [end()])
      expect(log).to.deep.equal([1, 2])
    })

    it('should call `end` subscribers on already ended property', () => {
      const s = prop()
      send(s, [end()])
      const log = []
      s.onEnd(() => log.push(1))
      s.onEnd(() => log.push(2))
      expect(log).to.deep.equal([1, 2])
    })

    it('should deactivate on end', () => {
      const s = prop()
      activate(s)
      expect(s).to.be.active()
      send(s, [end()])
      expect(s).not.to.be.active()
    })

    it('should stop deliver new values after end', () => {
      const s = prop()
      expect(s).to.emit([value(1), value(2), end()], () => send(s, [value(1), value(2), end(), value(3)]))
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
      expect(err && err.message).to.equal(undefined)
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
      expect(err && err.message).to.equal(undefined)
    })
  })

  describe('active state', () => {
    const fn = () => {}

    it('should activate when first subscriber added (value)', () => {
      const s = prop()
      s.onValue(fn)
      expect(s).to.be.active()
      s.offValue(fn)
    })

    it('should activate when first subscriber added (error)', () => {
      const s = prop()
      s.onError(fn)
      expect(s).to.be.active()
      s.offError(fn)
    })

    it('should activate when first subscriber added (end)', () => {
      const s = prop()
      s.onEnd(fn)
      expect(s).to.be.active()
      s.offEnd(fn)
    })

    it('should activate when first subscriber added (any)', () => {
      const s = prop()
      s.onAny(fn)
      expect(s).to.be.active()
      s.offAny(fn)
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
      expect(s).to.be.active()
      s.offEnd(end2)
      expect(s).not.to.be.active()
    })
  })

  describe('subscribers', () => {
    it('should deliver values and current', () => {
      const s = send(prop(), [value(0)])
      expect(s).to.emit([value(0, {current: true}), value(1), value(2)], () => send(s, [value(1), value(2)]))
    })

    it('should deliver errors and current error', () => {
      const s = send(prop(), [error(0)])
      expect(s).to.emit([error(0, {current: true}), error(1), error(2)], () => send(s, [error(1), error(2)]))
    })

    it('onValue subscribers should be called with 1 argument', () => {
      const fn = function() {
        return (count = arguments.length)
      }
      const s = send(prop(), [value(0)])
      let count = null
      s.onValue(fn)
      expect(count).to.equal(1)
      send(s, [value(1)])
      expect(count).to.equal(1)
      s.offValue(fn)
    })

    it('onError subscribers should be called with 1 argument', () => {
      const fn = function() {
        return (count = arguments.length)
      }
      const s = send(prop(), [error(0)])
      let count = null
      s.onError(fn)
      expect(count).to.equal(1)
      send(s, [error(1)])
      expect(count).to.equal(1)
      s.offError(fn)
    })

    it('onAny subscribers should be called with 1 arguments', () => {
      const fn = function() {
        return (count = arguments.length)
      }
      const s = send(prop(), [value(0)])
      let count = null
      s.onAny(fn)
      expect(count).to.equal(1)
      send(s, [value(1)])
      expect(count).to.equal(1)
      s.offAny(fn)
    })

    it('onEnd subscribers should be called with 0 arguments', () => {
      const fn = function() {
        return (count = arguments.length)
      }
      const s = send(prop(), [value(0)])
      let count = null
      s.onEnd(fn)
      send(s, [end()])
      expect(count).to.equal(0)
      s.onEnd(function() {
        return (count = arguments.length)
      })
      expect(count).to.equal(0)
      s.offEnd(fn)
    })

    it("can't have current value and error at same time", () => {
      const p = send(prop(), [value(0)])
      expect(p).to.emit([value(0, {current: true})])
      send(p, [error(1)])
      expect(p).to.emit([error(1, {current: true})])
      send(p, [value(2)])
      expect(p).to.emit([value(2, {current: true})])
    })

    it('should update catched current value before dispatching it', () => {
      const fn = x => {
        if (x === 1) {
          return p.onValue(spy)
        }
      }
      const p = send(prop(), [value(0)])
      const spy = sinon.spy()
      p.onValue(fn)
      send(p, [value(1)])
      expect(spy.args).to.deep.equal([[1]])
      p.offValue(fn)
      p.offValue(spy)
    })

    it('should update catched current error before dispatching it', () => {
      const fn = x => {
        if (x === 1) {
          return p.onError(spy)
        }
      }
      const p = send(prop(), [error(0)])
      const spy = sinon.spy()
      p.onError(fn)
      send(p, [error(1)])
      expect(spy.args).to.deep.equal([[1]])
      p.offError(fn)
      p.offError(spy)
    })
  })
})
