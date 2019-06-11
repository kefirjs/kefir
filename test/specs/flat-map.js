const {stream, prop, send, value, error, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

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
      expect(send(stream(), [end()]).flatMap()).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      expect(a.flatMap()).to.emit([value(1), value(2), value(0), value(3), value(4), end()], () => {
        send(b, [value(0)])
        send(a, [value(b)])
        send(b, [value(1), value(2)])
        send(a, [value(c), end()])
        send(b, [value(3), end()])
        send(c, [value(4), end()])
      })
    })

    it('should activate sub-sources', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      const map = a.flatMap()
      activate(map)
      send(a, [value(b), value(c)])
      deactivate(map)
      expect(map).to.activate(b, c)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMap(x => x.obs)).to.emit([value(1), value(2), end()], () => {
        send(b, [value(0)])
        send(a, [value({obs: b}), end()])
        send(b, [value(1), value(2), end()])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      const m = a.flatMap()
      activate(m)
      send(a, [value(b), value(c)])
      deactivate(m)
      expect(m).to.emit([value(1, {current: true}), value(2, {current: true})])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      expect(a.flatMap()).to.emit([value(1), value(2)], () => send(a, [value(b), value(c)]))
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
      ).to.emit([value(3), error(-1), value(4), error(-2), value(5)], () =>
        send(a, [value(1), value(2), value(3), value(-1), value(4), value(-2), value(5)])
      )
    })

    // https://github.com/kefirjs/kefir/issues/29
    it('Bug in flatMap: exception thrown when resubscribing to stream', () => {
      const src = stream()
      const stream1 = src.flatMap(x => x)
      const handler = () => {}
      stream1.onValue(handler)
      const sub = stream()
      send(src, [value(sub), end()])
      stream1.offValue(handler)
      send(sub, [end()])
      // Throws exception
      return stream1.onValue(handler)
    })

    it('errors should flow', () => {
      const a = stream()
      const b = stream()
      const c = prop()
      const result = a.flatMap()
      activate(result)
      send(a, [value(b), value(c)])
      deactivate(result)
      expect(result).to.flowErrors(a)
      expect(result).to.flowErrors(b)
      expect(result).to.flowErrors(c)
    })

    // https://github.com/kefirjs/kefir/issues/92
    it('Bug "flatMap with take(1) doesn\'t unsubscribe from source"', () => {
      let subs = 0
      let unsubs = 0
      const a = Kefir.stream(emitter => {
        subs++
        emitter.emit(1)
        return () => unsubs++
      })

      const b = Kefir.constant(1)
        .flatMap(() => a)
        .take(1)

      b.onValue(() => {})

      expect(subs).to.equal(1)
      expect(unsubs).to.equal(1)
    })

    it('should not error when source ends in response to synchronous value', () => {
      const src = stream()
      const result = src
        .flatMap(x => Kefir.constant(x))
        .onValue(x => {
          if (x === 1) {
            send(src, [end()])
          }
        })
      expect(result).to.emit([end()], () => {
        send(src, [value(1)])
      })
    })

    it('should be possible to add same obs twice on activation', () => {
      const b = send(prop(), [value(1)])
      const a = Kefir.stream(em => {
        em.emit(b)
        return em.emit(b)
      })
      expect(a.flatMap()).to.emit([value(1, {current: true}), value(1, {current: true})])
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
      expect(send(prop(), [end()]).flatMap()).to.emit([end({current: true})])
    })

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [value(send(prop(), [value(0), end()])), end()]).flatMap()).to.emit([
        value(0, {current: true}),
        end({current: true}),
      ]))

    it('should not costantly adding current value on each activation', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [value(a)])
      const map = b.flatMap()
      activate(map)
      deactivate(map)
      activate(map)
      deactivate(map)
      expect(map).to.emit([value(0, {current: true})])
    })

    it('should allow to add same obs several times', () => {
      const b = send(prop(), [value('b0')])
      const c = stream()
      const a = send(prop(), [value(b)])
      expect(a.flatMap()).to.emit(
        [
          value('b0', {current: true}),
          value('b0'),
          value('b0'),
          value('b0'),
          value('b0'),
          value('b1'),
          value('b1'),
          value('b1'),
          value('b1'),
          value('b1'),
          value('c1'),
          value('c1'),
          value('c1'),
          end(),
        ],
        () => {
          send(a, [value(b), value(c), value(b), value(c), value(c), value(b), value(b), end()])
          send(b, [value('b1'), end()])
          send(c, [value('c1'), end()])
        }
      )
    })

    it('should correctly handle current value of source', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [value(a)])
      expect(b.flatMap()).to.emit([value(0, {current: true})])
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
      send(a, [value(b), value(c)])
      deactivate(result)
      expect(result).to.flowErrors(b)
      expect(result).to.flowErrors(c)
    })
  })
})
