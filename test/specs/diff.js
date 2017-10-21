/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

const noop = function() {}
const minus = (prev, next) => prev - next

describe('diff', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().diff(noop, 0)).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.diff(noop, 0)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).diff(noop, 0)).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.diff(minus, 0)).toEmit([-1, -2, '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('works without fn argument', function() {
      const a = stream()
      return expect(a.diff(null, 0)).toEmit([[0, 1], [1, 3], '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('if no seed provided uses first value as seed', function() {
      let a = stream()
      expect(a.diff(minus)).toEmit([-1, -2, '<end>'], () => send(a, [0, 1, 3, '<end>']))
      a = stream()
      return expect(a.diff()).toEmit([[0, 1], [1, 3], '<end>'], () => send(a, [0, 1, 3, '<end>']))
    })

    return it('errors should flow', function() {
      const a = stream()
      return expect(a.diff()).errorsToFlow(a)
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().diff(noop, 0)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.diff(noop, 0)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).diff(noop, 0)).toEmit(['<end:current>']))

    it('should handle events and current', function() {
      const a = send(prop(), [1])
      return expect(a.diff(minus, 0)).toEmit([{current: -1}, -2, -3, '<end>'], () => send(a, [3, 6, '<end>']))
    })

    it('works without fn argument', function() {
      const a = send(prop(), [1])
      return expect(a.diff(null, 0)).toEmit([{current: [0, 1]}, [1, 3], [3, 6], '<end>'], () =>
        send(a, [3, 6, '<end>'])
      )
    })

    it('if no seed provided uses first value as seed', function() {
      let a = send(prop(), [0])
      expect(a.diff(minus)).toEmit([-1, -2, '<end>'], () => send(a, [1, 3, '<end>']))
      a = send(prop(), [0])
      return expect(a.diff()).toEmit([[0, 1], [1, 3], '<end>'], () => send(a, [1, 3, '<end>']))
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.diff()).errorsToFlow(a)
    })
  })
})
