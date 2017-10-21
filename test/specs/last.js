/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

describe('last', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().last()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.last()).toActivate(a)
    })

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).last()).toEmit(['<end:current>']))

    return it('should handle events', function() {
      const a = stream()
      return expect(a.last()).toEmit([{error: 5}, {error: 6}, 3, '<end>'], () =>
        send(a, [1, {error: 5}, {error: 6}, 2, 3, '<end>'])
      )
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().last()).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.last()).toActivate(a)
    })

    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).last()).toEmit(['<end:current>'])
      return expect(send(prop(), [1, '<end>']).last()).toEmit([{current: 1}, '<end:current>'])
    })

    return it('should handle events and current', function() {
      let a = send(prop(), [1])
      expect(a.last()).toEmit([{error: 5}, 1, '<end>'], () => send(a, [{error: 5}, '<end>']))

      a = send(prop(), [{error: 0}])
      return expect(a.last()).toEmit([{currentError: 0}, {error: 5}, 3, '<end>'], () =>
        send(a, [2, {error: 5}, 3, '<end>'])
      )
    })
  })
})
