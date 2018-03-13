const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

describe('skip', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().skip(3)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.skip(3)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).skip(3)).to.emit([end({current: true})])
    })

    it('should handle events (less than `n`)', () => {
      const a = stream()
      expect(a.skip(3)).to.emit([end()], () => send(a, [value(1), value(2), end()]))
    })

    it('should handle events (more than `n`)', () => {
      const a = stream()
      expect(a.skip(3)).to.emit([value(4), value(5), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('should handle events (n == 0)', () => {
      const a = stream()
      expect(a.skip(0)).to.emit([value(1), value(2), value(3), end()], () =>
        send(a, [value(1), value(2), value(3), end()])
      )
    })

    it('should handle events (n == -1)', () => {
      const a = stream()
      expect(a.skip(-1)).to.emit([value(1), value(2), value(3), end()], () =>
        send(a, [value(1), value(2), value(3), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.skip(1)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().skip(3)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.skip(3)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).skip(3)).to.emit([end({current: true})]))

    it('should handle events and current (less than `n`)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skip(3)).to.emit([end()], () => send(a, [value(2), end()]))
    })

    it('should handle events and current (more than `n`)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skip(3)).to.emit([value(4), value(5), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('should handle events and current (n == 0)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skip(0)).to.emit([value(1, {current: true}), value(2), value(3), end()], () =>
        send(a, [value(2), value(3), end()])
      )
    })

    it('should handle events and current (n == -1)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skip(-1)).to.emit([value(1, {current: true}), value(2), value(3), end()], () =>
        send(a, [value(2), value(3), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.skip(1)).to.flowErrors(a)
    })
  })
})
