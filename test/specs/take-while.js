const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

describe('takeWhile', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().takeWhile(() => true)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.takeWhile(() => true)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).takeWhile(() => true)).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.takeWhile(x => x < 4)).to.emit([value(1), value(2), value(3), end()], () => {
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      })
    })

    it('should handle events (natural end)', () => {
      const a = stream()
      expect(a.takeWhile(x => x < 4)).to.emit([value(1), value(2), end()], () => send(a, [value(1), value(2), end()]))
    })

    it('should handle events (with `-> false`)', () => {
      const a = stream()
      expect(a.takeWhile(() => false)).to.emit([end()], () => send(a, [value(1), value(2), end()]))
    })

    it('shoud use id as default predicate', () => {
      const a = stream()
      expect(a.takeWhile()).to.emit([value(1), value(2), end()], () =>
        send(a, [value(1), value(2), value(0), value(5), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.takeWhile()).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().takeWhile(() => true)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.takeWhile(() => true)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).takeWhile(() => true)).to.emit([end({current: true})]))

    it('should be ended if calback was `-> false` and source has a current', () =>
      expect(send(prop(), [value(1)]).takeWhile(() => false)).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = send(prop(), [value(1)])
      expect(a.takeWhile(x => x < 4)).to.emit([value(1, {current: true}), value(2), value(3), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('should handle events (natural end)', () => {
      const a = send(prop(), [value(1)])
      expect(a.takeWhile(x => x < 4)).to.emit([value(1, {current: true}), value(2), end()], () =>
        send(a, [value(2), end()])
      )
    })

    it('should handle events (with `-> false`)', () => {
      const a = prop()
      expect(a.takeWhile(() => false)).to.emit([end()], () => send(a, [value(1), value(2), end()]))
    })

    it('shoud use id as default predicate', () => {
      let a = send(prop(), [value(1)])
      expect(a.takeWhile()).to.emit([value(1, {current: true}), value(2), end()], () =>
        send(a, [value(2), value(0), value(5), end()])
      )
      a = send(prop(), [value(0)])
      expect(a.takeWhile()).to.emit([end({current: true})], () => send(a, [value(2), value(0), value(5), end()]))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.takeWhile()).to.flowErrors(a)
    })
  })
})
