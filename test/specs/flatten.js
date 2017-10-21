const {stream, prop, send, Kefir} = require('../test-helpers')

describe('flatten', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatten(() => {})).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatten(() => {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatten(() => {})).toEmit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(
        a.flatten(x => {
          if (x > 1) {
            return __range__(1, x, true)
          } else {
            return []
          }
        })
      ).toEmit([1, 2, {error: 4}, 1, 2, 3, '<end>'], () => send(a, [1, 2, {error: 4}, 3, '<end>']))
    })

    it('if no `fn` provided should use the `id` function by default', () => {
      const a = stream()
      expect(a.flatten()).toEmit([1, 2, 3, '<end>'], () => send(a, [[1], [], [2, 3], '<end>']))
    })
  })

  describe('property', () => {
    it('should return stream', () => {
      expect(prop().flatten(() => {})).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.flatten(() => {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).flatten(() => {})).toEmit(['<end:current>']))

    it('should handle events (handler skips current)', () => {
      const a = send(prop(), [1])
      expect(
        a.flatten(x => {
          if (x > 1) {
            return __range__(1, x, true)
          } else {
            return []
          }
        })
      ).toEmit([1, 2, {error: 4}, 1, 2, 3, '<end>'], () => send(a, [2, {error: 4}, 3, '<end>']))
    })

    it('should handle current correctly', () => {
      expect(send(prop(), [1]).flatten(x => [x])).toEmit([{current: 1}])
      expect(send(prop(), [{error: 0}]).flatten(() => {})).toEmit([{currentError: 0}])
    })

    it('should handle multiple currents correctly', () =>
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
