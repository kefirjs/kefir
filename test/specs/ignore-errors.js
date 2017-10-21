/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

describe('ignoreErrors', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().ignoreErrors()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.ignoreErrors()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).ignoreErrors()).toEmit(['<end:current>']))

    return it('should handle events', function() {
      const a = stream()
      return expect(a.ignoreErrors()).toEmit([1, 2, '<end>'], () => send(a, [1, {error: -1}, 2, {error: -2}, '<end>']))
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().ignoreErrors()).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.ignoreErrors()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).ignoreErrors()).toEmit(['<end:current>']))

    return it('should handle events and current', function() {
      let a = send(prop(), [{error: -1}])
      expect(a.ignoreErrors()).toEmit([2, 3, '<end>'], () => send(a, [2, {error: -2}, 3, {error: -3}, '<end>']))
      a = send(prop(), [1])
      return expect(a.ignoreErrors()).toEmit([{current: 1}, 2, 3, '<end>'], () =>
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      )
    })
  })
})
