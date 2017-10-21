/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

describe('endOnError', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().endOnError()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.endOnError()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).endOnError()).toEmit(['<end:current>']))

    return it('should handle events', function() {
      let a = stream()
      expect(a.endOnError()).toEmit([1, {error: 5}, '<end>'], () => send(a, [1, {error: 5}, 2]))
      a = stream()
      return expect(a.endOnError()).toEmit([1, 2, '<end>'], () => send(a, [1, 2, '<end>']))
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().endOnError()).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.endOnError()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).endOnError()).toEmit(['<end:current>']))

    it('should handle events and current', function() {
      let a = send(prop(), [1])
      expect(a.endOnError()).toEmit([{current: 1}, {error: 5}, '<end>'], () => send(a, [{error: 5}, 2]))
      a = send(prop(), [1])
      return expect(a.endOnError()).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, '<end>']))
    })

    return it('should handle currents', function() {
      let a = send(prop(), [{error: -1}])
      expect(a.endOnError()).toEmit([{currentError: -1}, '<end:current>'])
      a = send(prop(), [{error: -1}, '<end>'])
      expect(a.endOnError()).toEmit([{currentError: -1}, '<end:current>'])
      a = send(prop(), [1])
      expect(a.endOnError()).toEmit([{current: 1}])
      a = send(prop(), [1, '<end>'])
      return expect(a.endOnError()).toEmit([{current: 1}, '<end:current>'])
    })
  })
})
