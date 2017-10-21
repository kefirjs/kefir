/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir, activate, deactivate} = require('../test-helpers.coffee')
const sinon = require('sinon')

const noop = function() {}
const minus = (prev, next) => prev - next

describe('scan', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().scan(noop, 0)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.scan(noop, 0)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).scan(noop, 0)).toEmit([{current: 0}, '<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.scan(minus, 0)).toEmit([{current: 0}, -1, -4, '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('if no seed provided uses first value as seed', function() {
      const a = stream()
      return expect(a.scan(minus)).toEmit([0, -1, -4, '<end>'], () => send(a, [0, 1, 3, '<end>']))
    })

    it('errors should flow', function() {
      const a = stream()
      return expect(a.scan(minus)).errorsToFlow(a)
    })

    it('should never pass a value as current result if seed specified (test with error)', function() {
      const a = stream()
      const handler = sinon.stub().returns('abc')
      const b = a.scan(handler, 'seed')
      activate(b)
      send(a, [1, {error: 'err'}, 2, 3, '<end>'])
      deactivate(b)
      return expect(handler.args.filter(xs => typeof xs[0] === 'number')).toEqual([])
    })

    it('should fall back to the seed after error, if seed specified', function() {
      const a = stream()
      return expect(a.scan((res, x) => res + x, 'seed')).toEmit(
        [{current: 'seed'}, 'seed1', {error: 'err'}, 'seed2', 'seed23', '<end>'],
        () => send(a, [1, {error: 'err'}, 2, 3, '<end>'])
      )
    })

    return it('should use next value after error as seed, if seed not specified', function() {
      const a = stream()
      return expect(a.scan(() => 'abc')).toEmit([1, 'abc', {error: 'err'}, 3, 'abc', '<end>'], () =>
        send(a, [1, 2, {error: 'err'}, 3, 4, '<end>'])
      )
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().scan(noop, 0)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.scan(noop, 0)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).scan(noop, 0)).toEmit([{current: 0}, '<end:current>']))

    it('should handle events and current', function() {
      const a = send(prop(), [1])
      return expect(a.scan(minus, 0)).toEmit([{current: -1}, -4, -10, '<end>'], () => send(a, [3, 6, '<end>']))
    })

    it('if no seed provided uses first value as seed', function() {
      const a = send(prop(), [0])
      return expect(a.scan(minus)).toEmit([{current: 0}, -1, -4, '<end>'], () => send(a, [1, 3, '<end>']))
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.scan(minus)).errorsToFlow(a)
    })
  })
})