/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

describe('ignoreValues', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().ignoreValues()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.ignoreValues()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).ignoreValues()).toEmit(['<end:current>']))

    return it('should handle events', function() {
      const a = stream()
      return expect(a.ignoreValues()).toEmit([{error: -1}, {error: -2}, '<end>'], () =>
        send(a, [1, {error: -1}, 2, {error: -2}, '<end>'])
      )
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().ignoreValues()).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.ignoreValues()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).ignoreValues()).toEmit(['<end:current>']))

    return it('should handle events and current', function() {
      const a = send(prop(), [1, {error: -1}])
      return expect(a.ignoreValues()).toEmit([{currentError: -1}, {error: -2}, {error: -3}, '<end>'], () =>
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      )
    })
  })
})
