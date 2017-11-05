const {stream, prop, send, value, error, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('flatMapErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMapErrors()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMapErrors()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).flatMapErrors()).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      expect(a.flatMapErrors()).to.emit([value(1), value(2), value(0), value(3), value(4), end()], () => {
        send(b, [value(0)])
        send(a, [error(b)])
        send(b, [value(1), value(2)])
        send(a, [error(c), end()])
        send(b, [value(3), end()])
        send(c, [value(4), end()])
      })
    })

    it('should activate sub-sources', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      const map = a.flatMapErrors()
      activate(map)
      send(a, [error(b), error(c)])
      deactivate(map)
      expect(map).to.activate(b, c)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMapErrors(x => x.obs)).to.emit([value(1), value(2), end()], () => {
        send(b, [value(0)])
        send(a, [error({obs: b}), end()])
        send(b, [value(1), value(2), end()])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      const m = a.flatMapErrors()
      activate(m)
      send(a, [error(b), error(c)])
      deactivate(m)
      expect(m).to.emit([value(1, {current: true}), value(2, {current: true})])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      expect(a.flatMapErrors()).to.emit([value(1), value(2)], () => send(a, [error(b), error(c)]))
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
      ).to.emit([value(3), error(-1), value(4), error(-2), value(5)], () =>
        send(a, [value(1), value(2), value(3), value(-1), value(4), value(-2), value(5)])
      )
    })

    it('values should flow', () => {
      const a = stream()
      expect(a.flatMapErrors()).to.emit([value(1), value(2), value(3)], () => send(a, [value(1), value(2), value(3)]))
    })

    it('should be possible to add same obs twice on activation', () => {
      const b = send(prop(), [value(1)])
      const a = Kefir.stream(em => {
        em.error(b)
        return em.error(b)
      })
      expect(a.flatMapErrors()).to.emit([value(1, {current: true}), value(1, {current: true})])
    })
  })

  describe('property', () => {
    it('should be ended if source was ended (with current error)', () =>
      expect(send(prop(), [error(send(prop(), [value(0), end()])), end()]).flatMapErrors()).to.emit([
        value(0, {current: true}),
        end({current: true}),
      ]))

    it('should not costantly adding current value on each activation', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [error(a)])
      const map = b.flatMapErrors()
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
      expect(a.valuesToErrors().flatMapErrors()).to.emit(
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

    it('should correctly handle current error of source', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [error(a)])
      expect(b.flatMapErrors()).to.emit([value(0, {current: true})])
    })

    it('values should flow', () => {
      const a = send(prop(), [value(0)])
      expect(a.flatMapErrors()).to.emit([value(0, {current: true}), value(1), value(2), value(3)], () =>
        send(a, [value(1), value(2), value(3)])
      )
    })
  })
})
