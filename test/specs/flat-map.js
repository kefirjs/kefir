/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe('flatMap', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().flatMap()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.flatMap()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatMap()).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      return expect(a.flatMap()).toEmit([1, 2, 0, 3, 4, '<end>'], function() {
        send(b, [0])
        send(a, [b])
        send(b, [1, 2])
        send(a, [c, '<end>'])
        send(b, [3, '<end>'])
        return send(c, [4, '<end>'])
      })
    })

    it('should activate sub-sources', function() {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      const map = a.flatMap()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      return expect(map).toActivate(b, c)
    })

    it('should accept optional map fn', function() {
      const a = stream()
      const b = stream()
      return expect(a.flatMap(x => x.obs)).toEmit([1, 2, '<end>'], function() {
        send(b, [0])
        send(a, [{obs: b}, '<end>'])
        return send(b, [1, 2, '<end>'])
      })
    })

    it('should correctly handle current values of sub sources on activation', function() {
      const a = stream()
      const b = send(prop(), [1])
      const c = send(prop(), [2])
      const m = a.flatMap()
      activate(m)
      send(a, [b, c])
      deactivate(m)
      return expect(m).toEmit([{current: 1}, {current: 2}])
    })

    it('should correctly handle current values of new sub sources', function() {
      const a = stream()
      const b = send(prop(), [1])
      const c = send(prop(), [2])
      return expect(a.flatMap()).toEmit([1, 2], () => send(a, [b, c]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', function() {
      const a = stream()
      return expect(
        a.flatMap(function(x) {
          if (x > 2) {
            return Kefir.constant(x)
          } else if (x < 0) {
            return Kefir.constantError(x)
          } else {
            return Kefir.never()
          }
        })
      ).toEmit([3, {error: -1}, 4, {error: -2}, 5], () => send(a, [1, 2, 3, -1, 4, -2, 5]))
    })

    // https://github.com/rpominov/kefir/issues/29
    it('Bug in flatMap: exception thrown when resubscribing to stream', function() {
      const src = stream()
      const stream1 = src.flatMap(x => x)
      const handler = function() {}
      stream1.onValue(handler)
      const sub = stream()
      send(src, [sub, '<end>'])
      stream1.offValue(handler)
      send(sub, ['<end>'])
      // Throws exception
      return stream1.onValue(handler)
    })

    it('errors should flow', function() {
      const a = stream()
      const b = stream()
      const c = prop()
      const result = a.flatMap()
      activate(result)
      send(a, [b, c])
      deactivate(result)
      expect(result).errorsToFlow(a)
      expect(result).errorsToFlow(b)
      return expect(result).errorsToFlow(c)
    })

    // https://github.com/rpominov/kefir/issues/92
    it('Bug "flatMap with take(1) doesn\'t unsubscribe from source"', function() {
      let subs = 0
      let unsubs = 0
      const a = Kefir.stream(function(emitter) {
        subs++
        emitter.emit(1)
        return () => unsubs++
      })

      const b = Kefir.constant(1).flatMap(() => a).take(1)

      b.onValue(function() {})

      expect(subs).toBe(1)
      return expect(unsubs).toBe(1)
    })

    return it('should be possible to add same obs twice on activation', function() {
      const b = send(prop(), [1])
      const a = Kefir.stream(function(em) {
        em.emit(b)
        return em.emit(b)
      })
      return expect(a.flatMap()).toEmit([{current: 1}, {current: 1}])
    })
  })

  return describe('property', function() {
    it('should return stream', () => expect(prop().flatMap()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.flatMap()).toActivate(a)
    })

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).flatMap()).toEmit(['<end:current>']))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMap()).toEmit([{current: 0}, '<end:current>']))

    it('should not costantly adding current value on each activation', function() {
      const a = send(prop(), [0])
      const b = send(prop(), [a])
      const map = b.flatMap()
      activate(map)
      deactivate(map)
      activate(map)
      deactivate(map)
      return expect(map).toEmit([{current: 0}])
    })

    it('should allow to add same obs several times', function() {
      const b = send(prop(), ['b0'])
      const c = stream()
      const a = send(prop(), [b])
      return expect(a.flatMap()).toEmit(
        [{current: 'b0'}, 'b0', 'b0', 'b0', 'b0', 'b1', 'b1', 'b1', 'b1', 'b1', 'c1', 'c1', 'c1', '<end>'],
        function() {
          send(a, [b, c, b, c, c, b, b, '<end>'])
          send(b, ['b1', '<end>'])
          return send(c, ['c1', '<end>'])
        }
      )
    })

    it('should correctly handle current value of source', function() {
      const a = send(prop(), [0])
      const b = send(prop(), [a])
      return expect(b.flatMap()).toEmit([{current: 0}])
    })

    it('errors should flow 1', function() {
      const a = prop()
      const result = a.flatMap()
      return expect(result).errorsToFlow(a)
    })

    return it('errors should flow 2', function() {
      const a = prop()
      const b = stream()
      const c = prop()
      const result = a.flatMap()
      activate(result)
      send(a, [b, c])
      deactivate(result)
      expect(result).errorsToFlow(b)
      return expect(result).errorsToFlow(c)
    })
  })
})
