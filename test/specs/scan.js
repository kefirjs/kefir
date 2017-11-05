const {stream, prop, send, value, error, end, Kefir, activate, deactivate, expect} = require('../test-helpers')
const sinon = require('sinon')

const noop = () => {}
const minus = (prev, next) => prev - next

describe('scan', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().scan(noop, 0)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.scan(noop, 0)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).scan(noop, 0)).to.emit([value(0, {current: true}), end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      expect(a.scan(minus, 0)).to.emit([value(0, {current: true}), value(-1), value(-4), end()], () =>
        send(a, [value(1), value(3), end()])
      )
    })

    it('if no seed provided uses first value as seed', () => {
      const a = stream()
      expect(a.scan(minus)).to.emit([value(0), value(-1), value(-4), end()], () =>
        send(a, [value(0), value(1), value(3), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.scan(minus)).to.flowErrors(a)
    })

    it('should never pass a value as current result if seed specified (test with error)', () => {
      const a = stream()
      const handler = sinon.stub().returns('abc')
      const b = a.scan(handler, 'seed')
      activate(b)
      send(a, [value(1), error('err'), value(2), value(3), end()])
      deactivate(b)
      expect(handler.args.filter(xs => typeof xs[value(0)] === 'number')).to.deep.equal([])
    })

    it('should fall back to the seed after error, if seed specified', () => {
      const a = stream()
      expect(a.scan((res, x) => res + x, 'seed')).to.emit(
        [value('seed', {current: true}), value('seed1'), error('err'), value('seed2'), value('seed23'), end()],
        () => send(a, [value(1), error('err'), value(2), value(3), end()])
      )
    })

    it('should use next value after error as seed, if seed not specified', () => {
      const a = stream()
      expect(a.scan(() => 'abc')).to.emit([value(1), value('abc'), error('err'), value(3), value('abc'), end()], () =>
        send(a, [value(1), value(2), error('err'), value(3), value(4), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().scan(noop, 0)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.scan(noop, 0)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).scan(noop, 0)).to.emit([value(0, {current: true}), end({current: true})]))

    it('should handle events and current', () => {
      const a = send(prop(), [value(1)])
      expect(a.scan(minus, 0)).to.emit([value(-1, {current: true}), value(-4), value(-10), end()], () =>
        send(a, [value(3), value(6), end()])
      )
    })

    it('if no seed provided uses first value as seed', () => {
      const a = send(prop(), [value(0)])
      expect(a.scan(minus)).to.emit([value(0, {current: true}), value(-1), value(-4), end()], () =>
        send(a, [value(1), value(3), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.scan(minus)).to.flowErrors(a)
    })
  })
})
