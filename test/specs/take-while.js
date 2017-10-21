/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

describe('takeWhile', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().takeWhile(() => true)).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.takeWhile(() => true)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).takeWhile(() => true)).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.takeWhile(x => x < 4)).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']))
    })

    it('should handle events (natural end)', function() {
      const a = stream()
      return expect(a.takeWhile(x => x < 4)).toEmit([1, 2, '<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('should handle events (with `-> false`)', function() {
      const a = stream()
      return expect(a.takeWhile(() => false)).toEmit(['<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('shoud use id as default predicate', function() {
      const a = stream()
      return expect(a.takeWhile()).toEmit([1, 2, '<end>'], () => send(a, [1, 2, 0, 5, '<end>']))
    })

    return it('errors should flow', function() {
      const a = stream()
      return expect(a.takeWhile()).errorsToFlow(a)
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().takeWhile(() => true)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.takeWhile(() => true)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).takeWhile(() => true)).toEmit(['<end:current>']))

    it('should be ended if calback was `-> false` and source has a current', () =>
      expect(send(prop(), [1]).takeWhile(() => false)).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = send(prop(), [1])
      return expect(a.takeWhile(x => x < 4)).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, 4, 5, '<end>']))
    })

    it('should handle events (natural end)', function() {
      const a = send(prop(), [1])
      return expect(a.takeWhile(x => x < 4)).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, '<end>']))
    })

    it('should handle events (with `-> false`)', function() {
      const a = prop()
      return expect(a.takeWhile(() => false)).toEmit(['<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('shoud use id as default predicate', function() {
      let a = send(prop(), [1])
      expect(a.takeWhile()).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, 0, 5, '<end>']))
      a = send(prop(), [0])
      return expect(a.takeWhile()).toEmit(['<end:current>'], () => send(a, [2, 0, 5, '<end>']))
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.takeWhile()).errorsToFlow(a)
    })
  })
})
