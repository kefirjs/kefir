/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe('flatMapFirst', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().flatMapFirst()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.flatMapFirst()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatMapFirst()).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      const b = stream()
      const c = stream()
      return expect(a.flatMapFirst()).toEmit([1, 2, 4, '<end>'], function() {
        send(b, [0])
        send(a, [b])
        send(b, [1])
        send(a, [c])
        send(b, [2, '<end>'])
        send(c, [3])
        send(a, [c, '<end>'])
        return send(c, [4, '<end>'])
      })
    })

    it('should activate sub-sources (only first)', function() {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      const map = a.flatMapFirst()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).toActivate(b)
      return expect(map).not.toActivate(c)
    })

    it('should accept optional map fn', function() {
      const a = stream()
      const b = stream()
      return expect(a.flatMapFirst(x => x.obs)).toEmit([1, 2, '<end>'], function() {
        send(a, [{obs: b}, '<end>'])
        return send(b, [1, 2, '<end>'])
      })
    })

    it('should correctly handle current values of sub sources on activation', function() {
      const a = stream()
      const b = send(prop(), [1])
      const c = send(prop(), [2])
      const m = a.flatMapFirst()
      activate(m)
      send(a, [b, c])
      deactivate(m)
      return expect(m).toEmit([{current: 1}])
    })

    it('should correctly handle current values of new sub sources', function() {
      const a = stream()
      const b = send(prop(), [1, '<end>'])
      const c = send(prop(), [2])
      const d = send(prop(), [3])
      return expect(a.flatMapFirst()).toEmit([1, 2], () => send(a, [b, c, d]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', function() {
      const a = stream()
      return expect(
        a.flatMapFirst(function(x) {
          if (x > 2) {
            return Kefir.constant(x)
          } else {
            return Kefir.never()
          }
        })
      ).toEmit([3, 4, 5], () => send(a, [1, 2, 3, 4, 5]))
    })

    return it('should not call transformer function when skiping values', function() {
      let count = 0
      const a = stream()
      const b = stream()
      const c = stream()
      const result = a.flatMapFirst(function(x) {
        count++
        return x
      })
      activate(result)
      expect(count).toBe(0)
      send(a, [b])
      expect(count).toBe(1)
      send(a, [c])
      expect(count).toBe(1)
      send(b, ['<end>'])
      expect(count).toBe(1)
      send(a, [c])
      return expect(count).toBe(2)
    })
  })

  return describe('property', function() {
    it('should return stream', () => expect(prop().flatMapFirst()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.flatMapFirst()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).flatMapFirst()).toEmit(['<end:current>']))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapFirst()).toEmit([
        {current: 0},
        '<end:current>',
      ]))

    return it('should correctly handle current value of source', function() {
      const a = send(prop(), [0])
      const b = send(prop(), [a])
      return expect(b.flatMapFirst()).toEmit([{current: 0}])
    })
  })
})
