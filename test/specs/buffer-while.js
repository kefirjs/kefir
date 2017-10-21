/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

const not3 = x => x !== 3

describe('bufferWhile', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().bufferWhile(not3)).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.bufferWhile(not3)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).bufferWhile(not3)).toEmit(['<end:current>']))

    it('should work correctly', function() {
      const a = stream()
      return expect(a.bufferWhile(not3)).toEmit([[3], [1, 2, 3], [4, 3], [3], [5, 6], '<end>'], () =>
        send(a, [3, 1, 2, 3, 4, 3, 3, 5, 6, '<end>'])
      )
    })

    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      const a = stream()
      return expect(a.bufferWhile(not3, {flushOnEnd: false})).toEmit([[3], [1, 2, 3], [4, 3], [3], '<end>'], () =>
        send(a, [3, 1, 2, 3, 4, 3, 3, 5, 6, '<end>'])
      )
    })

    return it('errors should flow', function() {
      const a = stream()
      return expect(a.bufferWhile(not3)).errorsToFlow(a)
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().bufferWhile(not3)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.bufferWhile(not3)).toActivate(a)
    })

    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).bufferWhile(not3)).toEmit(['<end:current>'])
      expect(send(prop(), [3, '<end>']).bufferWhile(not3)).toEmit([{current: [3]}, '<end:current>'])
      expect(send(prop(), [2, '<end>']).bufferWhile(not3)).toEmit([{current: [2]}, '<end:current>'])
      expect(send(prop(), [3, '<end>']).bufferWhile(not3, {flushOnEnd: false})).toEmit([
        {current: [3]},
        '<end:current>',
      ])
      return expect(send(prop(), [2, '<end>']).bufferWhile(not3, {flushOnEnd: false})).toEmit(['<end:current>'])
    })

    it('should work correctly', function() {
      let a = send(prop(), [3])
      expect(a.bufferWhile(not3)).toEmit([{current: [3]}, [1, 2, 3], [4, 3], [3], [5, 6], '<end>'], () =>
        send(a, [1, 2, 3, 4, 3, 3, 5, 6, '<end>'])
      )
      a = send(prop(), [1])
      return expect(a.bufferWhile(not3)).toEmit([[1, 2, 3], [5, 6], '<end>'], () => send(a, [2, 3, 5, 6, '<end>']))
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.bufferWhile(not3)).errorsToFlow(a)
    })
  })
})
