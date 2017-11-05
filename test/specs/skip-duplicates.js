const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

describe('skipDuplicates', () => {
  const roundlyEqual = (a, b) => Math.round(a) === Math.round(b)

  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().skipDuplicates()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.skipDuplicates()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).skipDuplicates()).to.emit([end({current: true})]))

    it('should handle events (default comparator)', () => {
      const a = stream()
      expect(a.skipDuplicates()).to.emit([value(1), value(2), value(3), end()], () =>
        send(a, [value(1), value(1), value(2), value(3), value(3), end()])
      )
    })

    it('should handle events (custom comparator)', () => {
      const a = stream()
      expect(a.skipDuplicates(roundlyEqual)).to.emit([value(1), value(2), value(3.8), end()], () =>
        send(a, [value(1), value(1.1), value(2), value(3.8), value(4), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.skipDuplicates()).to.flowErrors(a)
    })

    it('should help with creating circular dependencies', () => {
      // https://github.com/rpominov/kefir/issues/42

      const a = stream()
      const b = Kefir.pool()
      b.plug(a)
      b.plug(b.map(x => x).skipDuplicates())
      expect(b).to.emit([value(1), value(1)], () => send(a, [value(1)]))
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().skipDuplicates()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.skipDuplicates()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).skipDuplicates()).to.emit([end({current: true})]))

    it('should handle events and current (default comparator)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skipDuplicates()).to.emit([value(1, {current: true}), value(2), value(3), end()], () =>
        send(a, [value(1), value(1), value(2), value(3), value(3), end()])
      )
    })

    it('should handle events and current (custom comparator)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skipDuplicates(roundlyEqual)).to.emit([value(1, {current: true}), value(2), value(3), end()], () =>
        send(a, [value(1.1), value(1.2), value(2), value(3), value(3.2), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.skipDuplicates()).to.flowErrors(a)
    })
  })
})
