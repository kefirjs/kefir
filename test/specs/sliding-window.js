/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

describe('slidingWindow', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().slidingWindow(1)).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.slidingWindow(1)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).slidingWindow(1)).toEmit(['<end:current>']))

    it('.slidingWindow(3) should work correctly', function() {
      const a = stream()
      return expect(a.slidingWindow(3)).toEmit([[1], [1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], () =>
        send(a, [1, 2, 3, 4, 5, '<end>'])
      )
    })

    it('.slidingWindow(3, 2) should work correctly', function() {
      const a = stream()
      return expect(a.slidingWindow(3, 2)).toEmit([[1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], () =>
        send(a, [1, 2, 3, 4, 5, '<end>'])
      )
    })

    it('.slidingWindow(3, 3) should work correctly', function() {
      const a = stream()
      return expect(a.slidingWindow(3, 3)).toEmit([[1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], () =>
        send(a, [1, 2, 3, 4, 5, '<end>'])
      )
    })

    it('.slidingWindow(3, 4) should work correctly', function() {
      const a = stream()
      return expect(a.slidingWindow(3, 4)).toEmit(['<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']))
    })

    return it('errors should flow', function() {
      const a = stream()
      return expect(a.slidingWindow(3, 4)).errorsToFlow(a)
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().slidingWindow(1)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.slidingWindow(1)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).slidingWindow(1)).toEmit(['<end:current>']))

    it('.slidingWindow(3) should work correctly', function() {
      const a = send(prop(), [1])
      return expect(a.slidingWindow(3)).toEmit([{current: [1]}, [1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], () =>
        send(a, [2, 3, 4, 5, '<end>'])
      )
    })

    it('.slidingWindow(3, 2) should work correctly', function() {
      const a = send(prop(), [1])
      return expect(a.slidingWindow(3, 2)).toEmit([[1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], () =>
        send(a, [2, 3, 4, 5, '<end>'])
      )
    })

    it('.slidingWindow(3, 3) should work correctly', function() {
      const a = send(prop(), [1])
      return expect(a.slidingWindow(3, 3)).toEmit([[1, 2, 3], [2, 3, 4], [3, 4, 5], '<end>'], () =>
        send(a, [2, 3, 4, 5, '<end>'])
      )
    })

    it('.slidingWindow(3, 4) should work correctly', function() {
      const a = send(prop(), [1])
      return expect(a.slidingWindow(3, 4)).toEmit(['<end>'], () => send(a, [2, 3, 4, 5, '<end>']))
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.slidingWindow(3, 4)).errorsToFlow(a)
    })
  })
})
