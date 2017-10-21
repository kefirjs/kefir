/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

const handler = x => ({
  convert: x < 0,
  error: x * 3,
})

describe('valuesToErrors', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().valuesToErrors(function() {})).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.valuesToErrors(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).valuesToErrors(function() {})).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.valuesToErrors(handler)).toEmit([1, {error: -6}, {error: -3}, {error: -12}, 5, '<end>'], () =>
        send(a, [1, -2, {error: -3}, -4, 5, '<end>'])
      )
    })

    return it('default handler should convert all values', function() {
      const a = stream()
      return expect(a.valuesToErrors()).toEmit(
        [{error: 1}, {error: -2}, {error: -3}, {error: -4}, {error: 5}, '<end>'],
        () => send(a, [1, -2, {error: -3}, -4, 5, '<end>'])
      )
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().valuesToErrors(function() {})).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.valuesToErrors(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).valuesToErrors(function() {})).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = send(prop(), [1])
      return expect(a.valuesToErrors(handler)).toEmit(
        [{current: 1}, {error: -6}, {error: -3}, {error: -12}, 5, '<end>'],
        () => send(a, [-2, {error: -3}, -4, 5, '<end>'])
      )
    })

    return it('should handle currents', function() {
      let a = send(prop(), [2])
      expect(a.valuesToErrors(handler)).toEmit([{current: 2}])
      a = send(prop(), [-2])
      expect(a.valuesToErrors(handler)).toEmit([{currentError: -6}])
      a = send(prop(), [{error: -2}])
      return expect(a.valuesToErrors(handler)).toEmit([{currentError: -2}])
    })
  })
})
