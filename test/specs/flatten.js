/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

describe('flatten', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().flatten(function() {})).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.flatten(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatten(function() {})).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(
        a.flatten(function(x) {
          if (x > 1) {
            return __range__(1, x, true)
          } else {
            return []
          }
        })
      ).toEmit([1, 2, {error: 4}, 1, 2, 3, '<end>'], () => send(a, [1, 2, {error: 4}, 3, '<end>']))
    })

    return it('if no `fn` provided should use the `id` function by default', function() {
      const a = stream()
      return expect(a.flatten()).toEmit([1, 2, 3, '<end>'], () => send(a, [[1], [], [2, 3], '<end>']))
    })
  })

  return describe('property', function() {
    it('should return stream', () => expect(prop().flatten(function() {})).toBeStream())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.flatten(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).flatten(function() {})).toEmit(['<end:current>']))

    it('should handle events (handler skips current)', function() {
      const a = send(prop(), [1])
      return expect(
        a.flatten(function(x) {
          if (x > 1) {
            return __range__(1, x, true)
          } else {
            return []
          }
        })
      ).toEmit([1, 2, {error: 4}, 1, 2, 3, '<end>'], () => send(a, [2, {error: 4}, 3, '<end>']))
    })

    it('should handle current correctly', function() {
      expect(send(prop(), [1]).flatten(x => [x])).toEmit([{current: 1}])
      return expect(send(prop(), [{error: 0}]).flatten(function() {})).toEmit([{currentError: 0}])
    })

    return it('should handle multiple currents correctly', () =>
      expect(send(prop(), [2]).flatten(x => __range__(1, x, true))).toEmit([{current: 1}, {current: 2}]))
  })
})

function __range__(left, right, inclusive) {
  let range = []
  let ascending = left < right
  let end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i)
  }
  return range
}
