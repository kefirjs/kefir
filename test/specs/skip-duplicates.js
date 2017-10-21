/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

describe('skipDuplicates', function() {
  const roundlyEqual = (a, b) => Math.round(a) === Math.round(b)

  describe('stream', function() {
    it('should return stream', () => expect(stream().skipDuplicates()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.skipDuplicates()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).skipDuplicates()).toEmit(['<end:current>']))

    it('should handle events (default comparator)', function() {
      const a = stream()
      return expect(a.skipDuplicates()).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 1, 2, 3, 3, '<end>']))
    })

    it('should handle events (custom comparator)', function() {
      const a = stream()
      return expect(a.skipDuplicates(roundlyEqual)).toEmit([1, 2, 3.8, '<end>'], () =>
        send(a, [1, 1.1, 2, 3.8, 4, '<end>'])
      )
    })

    it('errors should flow', function() {
      const a = stream()
      return expect(a.skipDuplicates()).errorsToFlow(a)
    })

    return it('should help with creating circular dependencies', function() {
      // https://github.com/rpominov/kefir/issues/42

      const a = stream()
      const b = Kefir.pool()
      b.plug(a)
      b.plug(b.map(x => x).skipDuplicates())
      return expect(b).toEmit([1, 1], () => send(a, [1]))
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().skipDuplicates()).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.skipDuplicates()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).skipDuplicates()).toEmit(['<end:current>']))

    it('should handle events and current (default comparator)', function() {
      const a = send(prop(), [1])
      return expect(a.skipDuplicates()).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [1, 1, 2, 3, 3, '<end>']))
    })

    it('should handle events and current (custom comparator)', function() {
      const a = send(prop(), [1])
      return expect(a.skipDuplicates(roundlyEqual)).toEmit([{current: 1}, 2, 3, '<end>'], () =>
        send(a, [1.1, 1.2, 2, 3, 3.2, '<end>'])
      )
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.skipDuplicates()).errorsToFlow(a)
    })
  })
})
