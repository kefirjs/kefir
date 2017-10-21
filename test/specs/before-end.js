/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

describe('beforeEnd', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().beforeEnd(function() {})).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.beforeEnd(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).beforeEnd(() => 42)).toEmit([{current: 42}, '<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.beforeEnd(() => 42)).toEmit([1, 2, 42, '<end>'], () => send(a, [1, 2, '<end>']))
    })

    return it('errors should flow', function() {
      const a = stream()
      return expect(a.beforeEnd(function() {})).errorsToFlow(a)
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().beforeEnd(function() {})).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.beforeEnd(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).beforeEnd(() => 42)).toEmit([{current: 42}, '<end:current>'])
      return expect(send(prop(), [1, '<end>']).beforeEnd(() => 42)).toEmit([{current: 42}, '<end:current>'])
    })

    it('should handle events and current', function() {
      const a = send(prop(), [1])
      return expect(a.beforeEnd(() => 42)).toEmit([{current: 1}, 2, 3, 42, '<end>'], () => send(a, [2, 3, '<end>']))
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.beforeEnd(function() {})).errorsToFlow(a)
    })
  })
})
