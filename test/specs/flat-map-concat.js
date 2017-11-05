const {stream, prop, send, value, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('flatMapConcat', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMapConcat()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMapConcat()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).flatMapConcat()).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = stream()
      expect(a.flatMapConcat()).to.emit([value(1), value(2), value(5), value(6), end()], () => {
        send(b, [value(0)])
        send(a, [value(b)])
        send(b, [value(1), value(2)])
        send(a, [value(c), end()])
        send(c, [value(4)])
        send(b, [value(5), end()])
        send(c, [value(6), end()])
      })
    })

    it('should activate sub-sources', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      const map = a.flatMapConcat()
      activate(map)
      send(a, [value(b), value(c)])
      deactivate(map)
      expect(map).to.activate(b)
      expect(map).not.to.activate(c)
      send(b, [end()])
      expect(map).to.activate(c)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMapConcat(x => x.obs)).to.emit([value(1), value(2), end()], () => {
        send(b, [value(0)])
        send(a, [value({obs: b}), end()])
        send(b, [value(1), value(2), end()])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const m = a.flatMapConcat()
      activate(m)
      send(a, [value(b)])
      deactivate(m)
      expect(m).to.emit([value(1, {current: true})])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [value(1), end()])
      const c = send(prop(), [value(2)])
      const d = send(prop(), [value(3)])
      expect(a.flatMapConcat()).to.emit([value(1), value(2)], () => send(a, [value(b), value(c), value(d)]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', () => {
      const a = stream()
      expect(
        a.flatMapConcat(x => {
          if (x > 2) {
            return Kefir.constant(x)
          } else {
            return Kefir.never()
          }
        })
      ).to.emit([value(3), value(4), value(5)], () => send(a, [value(1), value(2), value(3), value(4), value(5)]))
    })
  })

  describe('property', () => {
    it('should return stream', () => {
      expect(prop().flatMapConcat()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.flatMapConcat()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).flatMapConcat()).to.emit([end({current: true})]))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [value(send(prop(), [value(0), end()])), end()]).flatMapConcat()).to.emit([
        value(0, {current: true}),
        end({current: true}),
      ]))

    it('should correctly handle current value of source', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [value(a)])
      expect(b.flatMapConcat()).to.emit([value(0, {current: true})])
    })
  })
})
