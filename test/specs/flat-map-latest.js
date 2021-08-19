const sinon = require('sinon')
const {stream, prop, send, value, error, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('flatMapLatest', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMapLatest()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMapLatest()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).flatMapLatest()).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      expect(a.flatMapLatest()).to.emit([value(1), value(0), value(3), value(5), end()], () => {
        send(b, [value(0)])
        send(a, [value(b)])
        send(b, [value(1)])
        send(a, [value(c)])
        send(b, [value(2)])
        send(c, [value(3)])
        send(a, [value(b), end()])
        send(c, [value(4)])
        send(b, [value(5), end()])
      })
    })

    it('should activate sub-sources (only latest)', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [value(0)])
      const map = a.flatMapLatest()
      activate(map)
      send(a, [value(b), value(c)])
      deactivate(map)
      expect(map).to.activate(c)
      expect(map).not.to.activate(b)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMapLatest(x => x.obs)).to.emit([value(1), value(2), end()], () => {
        send(a, [value({obs: b}), end()])
        send(b, [value(1), value(2), end()])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      const m = a.flatMapLatest()
      activate(m)
      send(a, [value(b), value(c)])
      deactivate(m)
      expect(m).to.emit([value(2, {current: true})])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      expect(a.flatMapLatest()).to.emit([value(1), value(2)], () => send(a, [value(b), value(c)]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', () => {
      const a = stream()
      expect(
        a.flatMapLatest(x => {
          if (x > 2) {
            return Kefir.constant(x)
          } else {
            return Kefir.never()
          }
        })
      ).to.emit([value(3), value(4), value(5)], () => send(a, [value(1), value(2), value(3), value(4), value(5)]))
    })

    describe('non-overlapping', () => {
      it('should remove the previous stream before adding the next', () => {
        onDeactivate = sinon.spy()
        a = Kefir.stream(() => onDeactivate)
        b = stream()
        map = b.flatMapLatest()
        activate(map)
        send(b, [value(a)])
        send(b, [value(a)])
        deactivate(map)
        expect(onDeactivate.callCount).to.equal(2)
      })
    })

    describe('overlapping', () => {
      it('should add the next stream before removing the previous', () => {
        onDeactivate = sinon.spy()
        a = stream()
        b = Kefir.stream(() => onDeactivate)
        map = a.flatMapLatest({overlapping: true})
        activate(map)
        send(a, [value(b)])
        send(a, [value(b)])
        deactivate(map)
        expect(onDeactivate.callCount).to.equal(1)
      })

      it('should accept optional map fn', () => {
        onDeactivate = sinon.spy()
        a = stream()
        b = Kefir.stream(() => onDeactivate)
        map = a.flatMapLatest(x => x.obs, {overlapping: true})
        activate(map)
        send(a, [value({obs: b})])
        send(a, [value({obs: b})])
        deactivate(map)
        expect(onDeactivate.callCount).to.equal(1)
      })

      it('should work nicely with Kefir.constant and Kefir.never', () => {
        const a = stream()
        expect(
          a.flatMapLatest(
            x => {
              if (x > 2) {
                return Kefir.constant(x)
              } else {
                return Kefir.never()
              }
            },
            {overlapping: true}
          )
        ).to.emit([value(3), value(4), value(5)], () => send(a, [value(1), value(2), value(3), value(4), value(5)]))
      })
    })
  })

  describe('property', () => {
    it('should return stream', () => {
      expect(prop().flatMapLatest()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.flatMapLatest()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).flatMapLatest()).to.emit([end({current: true})]))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [value(send(prop(), [value(0), end()])), end()]).flatMapLatest()).to.emit([
        value(0, {current: true}),
        end({current: true}),
      ]))

    it('should correctly handle current value of source', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [value(a)])
      expect(b.flatMapLatest()).to.emit([value(0, {current: true})])
    })
  })
})
