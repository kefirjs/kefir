/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir, pool} = require('../test-helpers.coffee')

describe('take', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().take(3)).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.take(3)).toActivate(a)
    })

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).take(3)).toEmit(['<end:current>']))

    it('should be ended if `n` is 0', () => expect(stream().take(0)).toEmit(['<end:current>']))

    it('should handle events (less than `n`)', function() {
      const a = stream()
      return expect(a.take(3)).toEmit([1, 2, '<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('should handle events (more than `n`)', function() {
      const a = stream()
      return expect(a.take(3)).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']))
    })

    it('errors should flow', function() {
      const a = stream()
      return expect(a.take(1)).errorsToFlow(a)
    })

    return it('should emit once on circular dependency', function() {
      const a = pool()
      const b = a.take(1).map(x => x + 1)
      a.plug(b)

      return expect(b).toEmit([2, '<end>'], () => send(a, [1, 2, 3, 4, 5]))
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().take(3)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.take(3)).toActivate(a)
    })

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).take(3)).toEmit(['<end:current>']))

    it('should be ended if `n` is 0', () => expect(prop().take(0)).toEmit(['<end:current>']))

    it('should handle events and current (less than `n`)', function() {
      const a = send(prop(), [1])
      return expect(a.take(3)).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, '<end>']))
    })

    it('should handle events and current (more than `n`)', function() {
      const a = send(prop(), [1])
      return expect(a.take(3)).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, 4, 5, '<end>']))
    })

    it('should work correctly with .constant', () =>
      expect(Kefir.constant(1).take(1)).toEmit([{current: 1}, '<end:current>']))

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.take(1)).errorsToFlow(a)
    })
  })
})
