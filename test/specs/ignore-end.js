/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

describe('ignoreEnd', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().ignoreEnd()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.ignoreEnd()).toActivate(a)
    })

    it('should not be ended if source was ended', () => expect(send(stream(), ['<end>']).ignoreEnd()).toEmit([]))

    it('should handle events', function() {
      const a = stream()
      return expect(a.ignoreEnd()).toEmit([1, 2], () => send(a, [1, 2, '<end>']))
    })

    return it('errors should flow', function() {
      const a = stream()
      return expect(a.ignoreEnd()).errorsToFlow(a)
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().ignoreEnd()).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.ignoreEnd()).toActivate(a)
    })

    it('should not be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).ignoreEnd()).toEmit([])
      return expect(send(prop(), [1, '<end>']).ignoreEnd()).toEmit([{current: 1}])
    })

    it('should handle events and current', function() {
      const a = send(prop(), [1])
      return expect(a.ignoreEnd()).toEmit([{current: 1}, 2, 3], () => send(a, [2, 3, '<end>']))
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.ignoreEnd()).errorsToFlow(a)
    })
  })
})
