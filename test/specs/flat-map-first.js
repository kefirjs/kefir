const {stream, prop, send, value, error, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('flatMapFirst', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMapFirst()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMapFirst()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).flatMapFirst()).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = stream()
      expect(a.flatMapFirst()).to.emit([value(1), value(2), value(4), end()], () => {
        send(b, [value(0)])
        send(a, [value(b)])
        send(b, [value(1)])
        send(a, [value(c)])
        send(b, [value(2), end()])
        send(c, [value(3)])
        send(a, [value(c), end()])
        send(c, [value(4), end()])
      })
    })

    it('should activate sub-sources (only first)', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      const map = a.flatMapFirst()
      activate(map)
      send(a, [value(b), value(c)])
      deactivate(map)
      expect(map).to.activate(b)
      expect(map).not.to.activate(c)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMapFirst(x => x.obs)).to.emit([value(1), value(2), end()], () => {
        send(a, [value({obs: b}), end()])
        send(b, [value(1), value(2), end()])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      const m = a.flatMapFirst()
      activate(m)
      send(a, [value(b), value(c)])
      deactivate(m)
      expect(m).to.emit([value(1, {current: true})])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [value(1), end()])
      const c = send(prop(), [value(2)])
      const d = send(prop(), [value(3)])
      expect(a.flatMapFirst()).to.emit([value(1), value(2)], () => send(a, [value(b), value(c), value(d)]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', () => {
      const a = stream()
      expect(
        a.flatMapFirst(x => {
          if (x > 2) {
            return Kefir.constant(x)
          } else {
            return Kefir.never()
          }
        })
      ).to.emit([value(3), value(4), value(5)], () => send(a, [value(1), value(2), value(3), value(4), value(5)]))
    })

    it('should not call transformer function when skiping values', () => {
      let count = 0
      const a = stream()
      const b = stream()
      const c = stream()
      const result = a.flatMapFirst(x => {
        count++
        return x
      })
      activate(result)
      expect(count).to.equal(0)
      send(a, [value(b)])
      expect(count).to.equal(1)
      send(a, [value(c)])
      expect(count).to.equal(1)
      send(b, [end()])
      expect(count).to.equal(1)
      send(a, [value(c)])
      expect(count).to.equal(2)
      deactivate(result)
    })
  })

  describe('property', () => {
    it('should return stream', () => {
      expect(prop().flatMapFirst()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.flatMapFirst()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).flatMapFirst()).to.emit([end({current: true})]))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [value(send(prop(), [value(0), end()])), end()]).flatMapFirst()).to.emit([
        value(0, {current: true}),
        end({current: true}),
      ]))

    it('should correctly handle current value of source', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [value(a)])
      expect(b.flatMapFirst()).to.emit([value(0, {current: true})])
    })
  })
})
