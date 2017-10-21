const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers')

describe('flatMapErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMapErrors()).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMapErrors()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatMapErrors()).toEmit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      expect(a.flatMapErrors()).toEmit([1, 2, 0, 3, 4, '<end>'], () => {
        send(b, [0])
        send(a, [{error: b}])
        send(b, [1, 2])
        send(a, [{error: c}, '<end>'])
        send(b, [3, '<end>'])
        send(c, [4, '<end>'])
      })
    })

    it('should activate sub-sources', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      const map = a.flatMapErrors()
      activate(map)
      send(a, [{error: b}, {error: c}])
      deactivate(map)
      expect(map).toActivate(b, c)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMapErrors(x => x.obs)).toEmit([1, 2, '<end>'], () => {
        send(b, [0])
        send(a, [{error: {obs: b}}, '<end>'])
        send(b, [1, 2, '<end>'])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [1])
      const c = send(prop(), [2])
      const m = a.flatMapErrors()
      activate(m)
      send(a, [{error: b}, {error: c}])
      deactivate(m)
      expect(m).toEmit([{current: 1}, {current: 2}])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [1])
      const c = send(prop(), [2])
      expect(a.flatMapErrors()).toEmit([1, 2], () => send(a, [{error: b}, {error: c}]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', () => {
      const a = stream()
      expect(
        a.valuesToErrors().flatMapErrors(x => {
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

    it('values should flow', () => {
      const a = stream()
      expect(a.flatMapErrors()).toEmit([1, 2, 3], () => send(a, [1, 2, 3]))
    })

    it('should be possible to add same obs twice on activation', () => {
      const b = send(prop(), [1])
      const a = Kefir.stream(em => {
        em.error(b)
        return em.error(b)
      })
      expect(a.flatMapErrors()).toEmit([{current: 1}, {current: 1}])
    })
  })

  describe('property', () => {
    it('should be ended if source was ended (with current error)', () =>
      expect(send(prop(), [{error: send(prop(), [0, '<end>'])}, '<end>']).flatMapErrors()).toEmit([
        {current: 0},
        '<end:current>',
      ]))

    it('should not costantly adding current value on each activation', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [{error: a}])
      const map = b.flatMapErrors()
      activate(map)
      deactivate(map)
      activate(map)
      deactivate(map)
      expect(map).toEmit([{current: 0}])
    })

    it('should allow to add same obs several times', () => {
      const b = send(prop(), ['b0'])
      const c = stream()
      const a = send(prop(), [b])
      expect(a.valuesToErrors().flatMapErrors()).toEmit(
        [{current: 'b0'}, 'b0', 'b0', 'b0', 'b0', 'b1', 'b1', 'b1', 'b1', 'b1', 'c1', 'c1', 'c1', '<end>'],
        () => {
          send(a, [b, c, b, c, c, b, b, '<end>'])
          send(b, ['b1', '<end>'])
          send(c, ['c1', '<end>'])
        }
      )
    })

    it('should correctly handle current error of source', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [{error: a}])
      expect(b.flatMapErrors()).toEmit([{current: 0}])
    })

    it('values should flow', () => {
      const a = send(prop(), [0])
      expect(a.flatMapErrors()).toEmit([{current: 0}, 1, 2, 3], () => send(a, [1, 2, 3]))
    })
  })
})
