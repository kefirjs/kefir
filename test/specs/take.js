const {stream, prop, send, value, error, end, Kefir, pool, expect} = require('../test-helpers')

describe('take', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().take(3)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.take(3)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).take(3)).to.emit([end({current: true})])
    })

    it('should be ended if `n` is 0', () => {
      expect(stream().take(0)).to.emit([end({current: true})])
    })

    it('should handle events (less than `n`)', () => {
      const a = stream()
      expect(a.take(3)).to.emit([value(1), value(2), end()], () => send(a, [value(1), value(2), end()]))
    })

    it('should handle events (more than `n`)', () => {
      const a = stream()
      expect(a.take(3)).to.emit([value(1), value(2), value(3), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.take(1)).to.flowErrors(a)
    })

    it('should emit once on circular dependency', () => {
      const a = pool()
      const b = a.take(1).map(x => x + 1)
      a.plug(b)

      expect(b).to.emit([value(2), end()], () => send(a, [value(1), value(2), value(3), value(4), value(5)]))
    })
  })

  describe('property', () => {
    it('should return property', () => expect(prop().take(3)).to.be.observable.property())

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.take(3)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).take(3)).to.emit([end({current: true})])
    })

    it('should be ended if `n` is 0', () => {
      expect(prop().take(0)).to.emit([end({current: true})])
    })

    it('should handle events and current (less than `n`)', () => {
      const a = send(prop(), [value(1)])
      expect(a.take(3)).to.emit([value(1, {current: true}), value(2), end()], () => send(a, [value(2), end()]))
    })

    it('should handle events and current (more than `n`)', () => {
      const a = send(prop(), [value(1)])
      expect(a.take(3)).to.emit([value(1, {current: true}), value(2), value(3), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('should work correctly with .constant', () =>
      expect(Kefir.constant(1).take(1)).to.emit([value(1, {current: true}), end({current: true})]))

    it('errors should flow', () => {
      const a = prop()
      expect(a.take(1)).to.flowErrors(a)
    })
  })
})
