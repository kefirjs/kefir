const {stream, prop, send, Kefir, activate, deactivate, expect} = require('../test-helpers')
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
      expect(send(stream(), ['<end>']).scan(noop, 0)).to.emit([{current: 0}, '<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.scan(minus, 0)).to.emit([{current: 0}, -1, -4, '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('if no seed provided uses first value as seed', () => {
      const a = stream()
      expect(a.scan(minus)).to.emit([0, -1, -4, '<end>'], () => send(a, [0, 1, 3, '<end>']))
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
      send(a, [1, {error: 'err'}, 2, 3, '<end>'])
      deactivate(b)
      expect(handler.args.filter(xs => typeof xs[0] === 'number')).to.deep.equal([])
    })

    it('should fall back to the seed after error, if seed specified', () => {
      const a = stream()
      expect(a.scan((res, x) => res + x, 'seed')).to.emit(
        [{current: 'seed'}, 'seed1', {error: 'err'}, 'seed2', 'seed23', '<end>'],
        () => send(a, [1, {error: 'err'}, 2, 3, '<end>'])
      )
    })

    it('should use next value after error as seed, if seed not specified', () => {
      const a = stream()
      expect(a.scan(() => 'abc')).to.emit([1, 'abc', {error: 'err'}, 3, 'abc', '<end>'], () =>
        send(a, [1, 2, {error: 'err'}, 3, 4, '<end>'])
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
      expect(send(prop(), ['<end>']).scan(noop, 0)).to.emit([{current: 0}, '<end:current>']))

    it('should handle events and current', () => {
      const a = send(prop(), [1])
      expect(a.scan(minus, 0)).to.emit([{current: -1}, -4, -10, '<end>'], () => send(a, [3, 6, '<end>']))
    })

    it('if no seed provided uses first value as seed', () => {
      const a = send(prop(), [0])
      expect(a.scan(minus)).to.emit([{current: 0}, -1, -4, '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.scan(minus)).to.flowErrors(a)
    })
  })
})
