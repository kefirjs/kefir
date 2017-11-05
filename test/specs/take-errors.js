const {stream, prop, send, value, error, end, Kefir, pool, expect} = require('../test-helpers')

describe('takeErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().takeErrors(3)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.takeErrors(3)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).takeErrors(3)).to.emit([end({current: true})]))

    it('should be ended if `n` is 0', () => {
      expect(stream().takeErrors(0)).to.emit([end({current: true})])
    })

    it('should handle events (less than `n`)', () => {
      const a = stream()
      expect(a.takeErrors(3)).to.emit([error(1), error(2), end()], () => send(a, [error(1), error(2), end()]))
    })

    it('should handle events (more than `n`)', () => {
      const a = stream()
      expect(a.takeErrors(3)).to.emit([error(1), error(2), error(3), end()], () =>
        send(a, [error(1), error(2), error(3), error(4), error(5), end()])
      )
    })

    it('values should flow', () => {
      const a = stream()
      expect(a.takeErrors(1)).to.emit([value(1), value(2), value(3), end()], () =>
        send(a, [value(1), value(2), value(3), end()])
      )
    })

    it('should emit once on circular dependency', () => {
      const a = pool()
      const b = a.takeErrors(1).mapErrors(x => x + 1)
      a.plug(b)

      expect(b).to.emit([error(2), end()], () => send(a, [error(1), error(2), error(3), error(4), error(5)]))
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().takeErrors(3)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.takeErrors(3)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).takeErrors(3)).to.emit([end({current: true})]))

    it('should be ended if `n` is 0', () => expect(prop().takeErrors(0)).to.emit([end({current: true})]))

    it('should handle events and current (less than `n`)', () => {
      const a = send(prop(), [error(1)])
      expect(a.takeErrors(3)).to.emit([error(1, {current: true}), error(2), end()], () => send(a, [error(2), end()]))
    })

    it('should handle events and current (more than `n`)', () => {
      const a = send(prop(), [error(1)])
      expect(a.takeErrors(3)).to.emit([error(1, {current: true}), error(2), error(3), end()], () =>
        send(a, [error(2), error(3), error(4), error(5), end()])
      )
    })

    it('should work correctly with .constant', () =>
      expect(Kefir.constantError(1).takeErrors(1)).to.emit([error(1, {current: true}), end({current: true})]))

    it('values should flow', () => {
      const a = send(prop(), [value(1)])
      expect(a.takeErrors(1)).to.emit([value(1, {current: true}), value(2), value(3), value(4), end()], () =>
        send(a, [value(2), value(3), value(4), end()])
      )
    })
  })
})
