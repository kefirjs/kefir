const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

describe('skipWhile', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().skipWhile(() => false)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.skipWhile(() => false)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).skipWhile(() => false)).to.emit([end({current: true})]))

    it('should handle events (`-> true`)', () => {
      const a = stream()
      expect(a.skipWhile(() => true)).to.emit([end()], () => send(a, [value(1), value(2), end()]))
    })

    it('should handle events (`-> false`)', () => {
      const a = stream()
      expect(a.skipWhile(() => false)).to.emit([value(1), value(2), value(3), end()], () =>
        send(a, [value(1), value(2), value(3), end()])
      )
    })

    it('should handle events (`(x) -> x < 3`)', () => {
      const a = stream()
      expect(a.skipWhile(x => x < 3)).to.emit([value(3), value(4), value(5), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('shoud use id as default predicate', () => {
      const a = stream()
      expect(a.skipWhile()).to.emit([value(0), value(4), value(5), end()], () =>
        send(a, [value(1), value(2), value(0), value(4), value(5), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.skipWhile()).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().skipWhile(() => false)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.skipWhile(() => false)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).skipWhile(() => false)).to.emit([end({current: true})]))

    it('should handle events and current (`-> true`)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skipWhile(() => true)).to.emit([end()], () => send(a, [value(2), end()]))
    })

    it('should handle events and current (`-> false`)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skipWhile(() => false)).to.emit([value(1, {current: true}), value(2), value(3), end()], () =>
        send(a, [value(2), value(3), end()])
      )
    })

    it('should handle events and current (`(x) -> x < 3`)', () => {
      const a = send(prop(), [value(1)])
      expect(a.skipWhile(x => x < 3)).to.emit([value(3), value(4), value(5), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('shoud use id as default predicate', () => {
      let a = send(prop(), [value(1)])
      expect(a.skipWhile()).to.emit([value(0), value(4), value(5), end()], () =>
        send(a, [value(2), value(0), value(4), value(5), end()])
      )
      a = send(prop(), [value(0)])
      expect(a.skipWhile()).to.emit([value(0, {current: true}), value(2), value(0), value(4), value(5), end()], () =>
        send(a, [value(2), value(0), value(4), value(5), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.skipWhile()).to.flowErrors(a)
    })
  })
})
