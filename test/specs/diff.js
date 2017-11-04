const {stream, prop, send, value, end, expect} = require('../test-helpers')

const noop = () => {}
const minus = (prev, next) => prev - next

describe('diff', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().diff(noop, 0)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.diff(noop, 0)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).diff(noop, 0)).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.diff(minus, 0)).to.emit([value(-1), value(-2), end()], () => send(a, [value(1), value(3), end()]))
    })

    it('works without fn argument', () => {
      const a = stream()
      expect(a.diff(null, 0)).to.emit([value([0, 1]), value([1, 3]), end()], () => send(a, [value(1), value(3), end()]))
    })

    it('if no seed provided uses first value as seed', () => {
      let a = stream()
      expect(a.diff(minus)).to.emit([value(-1), value(-2), end()], () => send(a, [value(0), value(1), value(3), end()]))
      a = stream()
      expect(a.diff()).to.emit([value([0, 1]), value([1, 3]), end()], () =>
        send(a, [value(0), value(1), value(3), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.diff()).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().diff(noop, 0)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.diff(noop, 0)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).diff(noop, 0)).to.emit([end({current: true})])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [value(1)])
      expect(a.diff(minus, 0)).to.emit([value(-1, {current: true}), value(-2), value(-3), end()], () =>
        send(a, [value(3), value(6), end()])
      )
    })

    it('works without fn argument', () => {
      const a = send(prop(), [value(1)])
      expect(a.diff(null, 0)).to.emit([value([0, 1], {current: true}), value([1, 3]), value([3, 6]), end()], () =>
        send(a, [value(3), value(6), end()])
      )
    })

    it('if no seed provided uses first value as seed', () => {
      let a = send(prop(), [value(0)])
      expect(a.diff(minus)).to.emit([value(-1), value(-2), end()], () => send(a, [value(1), value(3), end()]))
      a = send(prop(), [value(0)])
      expect(a.diff()).to.emit([value([0, 1]), value([1, 3]), end()], () => send(a, [value(1), value(3), end()]))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.diff()).to.flowErrors(a)
    })
  })
})
