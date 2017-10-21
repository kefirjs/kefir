/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe('flatMapConcat', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().flatMapConcat()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.flatMapConcat()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatMapConcat()).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      const b = stream()
      const c = stream()
      return expect(a.flatMapConcat()).toEmit([1, 2, 5, 6, '<end>'], function() {
        send(b, [0])
        send(a, [b])
        send(b, [1, 2])
        send(a, [c, '<end>'])
        send(c, [4])
        send(b, [5, '<end>'])
        return send(c, [6, '<end>'])
      })
    })

    it('should activate sub-sources', function() {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      const map = a.flatMapConcat()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).toActivate(b)
      expect(map).not.toActivate(c)
      send(b, ['<end>'])
      return expect(map).toActivate(c)
    })

    it('should accept optional map fn', function() {
      const a = stream()
      const b = stream()
      return expect(a.flatMapConcat(x => x.obs)).toEmit([1, 2, '<end>'], function() {
        send(b, [0])
        send(a, [{obs: b}, '<end>'])
        return send(b, [1, 2, '<end>'])
      })
    })

    it('should correctly handle current values of sub sources on activation', function() {
      const a = stream()
      const b = send(prop(), [1])
      const m = a.flatMapConcat()
      activate(m)
      send(a, [b])
      deactivate(m)
      return expect(m).toEmit([{current: 1}])
    })

    it('should correctly handle current values of new sub sources', function() {
      const a = stream()
      const b = send(prop(), [1, '<end>'])
      const c = send(prop(), [2])
      const d = send(prop(), [3])
      return expect(a.flatMapConcat()).toEmit([1, 2], () => send(a, [b, c, d]))
    })

    return it('should work nicely with Kefir.constant and Kefir.never', function() {
      const a = stream()
      return expect(
        a.flatMapConcat(function(x) {
          if (x > 2) {
            return Kefir.constant(x)
          } else {
            return Kefir.never()
          }
        })
      ).toEmit([3, 4, 5], () => send(a, [1, 2, 3, 4, 5]))
    })
  })

  return describe('property', function() {
    it('should return stream', () => expect(prop().flatMapConcat()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.flatMapConcat()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).flatMapConcat()).toEmit(['<end:current>']))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapConcat()).toEmit([
        {current: 0},
        '<end:current>',
      ]))

    return it('should correctly handle current value of source', function() {
      const a = send(prop(), [0])
      const b = send(prop(), [a])
      return expect(b.flatMapConcat()).toEmit([{current: 0}])
    })
  })
})
