const {stream, prop, send, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('flatMap', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMap()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMap()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatMap()).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      expect(a.flatMap()).to.emit([1, 2, 0, 3, 4, '<end>'], () => {
        send(b, [0])
        send(a, [b])
        send(b, [1, 2])
        send(a, [c, '<end>'])
        send(b, [3, '<end>'])
        send(c, [4, '<end>'])
      })
    })

    it('should activate sub-sources', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      const map = a.flatMap()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).to.activate(b, c)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMap(x => x.obs)).to.emit([1, 2, '<end>'], () => {
        send(b, [0])
        send(a, [{obs: b}, '<end>'])
        send(b, [1, 2, '<end>'])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [1])
      const c = send(prop(), [2])
      const m = a.flatMap()
      activate(m)
      send(a, [b, c])
      deactivate(m)
      expect(m).to.emit([{current: 1}, {current: 2}])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [1])
      const c = send(prop(), [2])
      expect(a.flatMap()).to.emit([1, 2], () => send(a, [b, c]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', () => {
      const a = stream()
      expect(
        a.flatMap(x => {
          if (x > 2) {
            return Kefir.constant(x)
          } else if (x < 0) {
            return Kefir.constantError(x)
          } else {
            return Kefir.never()
          }
        })
      ).to.emit([3, {error: -1}, 4, {error: -2}, 5], () => send(a, [1, 2, 3, -1, 4, -2, 5]))
    })

    // https://github.com/rpominov/kefir/issues/29
    it('Bug in flatMap: exception thrown when resubscribing to stream', () => {
      const src = stream()
      const stream1 = src.flatMap(x => x)
      const handler = () => {}
      stream1.onValue(handler)
      const sub = stream()
      send(src, [sub, '<end>'])
      stream1.offValue(handler)
      send(sub, ['<end>'])
      // Throws exception
      return stream1.onValue(handler)
    })

    it('errors should flow', () => {
      const a = stream()
      const b = stream()
      const c = prop()
      const result = a.flatMap()
      activate(result)
      send(a, [b, c])
      deactivate(result)
      expect(result).to.flowErrors(a)
      expect(result).to.flowErrors(b)
      expect(result).to.flowErrors(c)
    })

    // https://github.com/rpominov/kefir/issues/92
    it('Bug "flatMap with take(1) doesn\'t unsubscribe from source"', () => {
      let subs = 0
      let unsubs = 0
      const a = Kefir.stream(emitter => {
        subs++
        emitter.emit(1)
        return () => unsubs++
      })

      const b = Kefir.constant(1).flatMap(() => a).take(1)

      b.onValue(() => {})

      expect(subs).to.equal(1)
      expect(unsubs).to.equal(1)
    })

    it('should be possible to add same obs twice on activation', () => {
      const b = send(prop(), [1])
      const a = Kefir.stream(em => {
        em.emit(b)
        return em.emit(b)
      })
      expect(a.flatMap()).to.emit([{current: 1}, {current: 1}])
    })
  })

  describe('property', () => {
    it('should return stream', () => {
      expect(prop().flatMap()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.flatMap()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).flatMap()).to.emit(['<end:current>'])
    })

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMap()).to.emit([{current: 0}, '<end:current>']))

    it('should not costantly adding current value on each activation', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [a])
      const map = b.flatMap()
      activate(map)
      deactivate(map)
      activate(map)
      deactivate(map)
      expect(map).to.emit([{current: 0}])
    })

    it('should allow to add same obs several times', () => {
      const b = send(prop(), ['b0'])
      const c = stream()
      const a = send(prop(), [b])
      expect(a.flatMap()).to.emit(
        [{current: 'b0'}, 'b0', 'b0', 'b0', 'b0', 'b1', 'b1', 'b1', 'b1', 'b1', 'c1', 'c1', 'c1', '<end>'],
        () => {
          send(a, [b, c, b, c, c, b, b, '<end>'])
          send(b, ['b1', '<end>'])
          send(c, ['c1', '<end>'])
        }
      )
    })

    it('should correctly handle current value of source', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [a])
      expect(b.flatMap()).to.emit([{current: 0}])
    })

    it('errors should flow 1', () => {
      const a = prop()
      const result = a.flatMap()
      expect(result).to.flowErrors(a)
    })

    it('errors should flow 2', () => {
      const a = prop()
      const b = stream()
      const c = prop()
      const result = a.flatMap()
      activate(result)
      send(a, [b, c])
      deactivate(result)
      expect(result).to.flowErrors(b)
      expect(result).to.flowErrors(c)
    })
  })
})
