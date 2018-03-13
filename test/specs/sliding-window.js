const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

describe('slidingWindow', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().slidingWindow(1)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.slidingWindow(1)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).slidingWindow(1)).to.emit([end({current: true})]))

    it('.slidingWindow(3) should work correctly', () => {
      const a = stream()
      expect(a.slidingWindow(3)).to.emit(
        [value([1]), value([1, 2]), value([1, 2, 3]), value([2, 3, 4]), value([3, 4, 5]), end()],
        () => send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.slidingWindow(3, 2) should work correctly', () => {
      const a = stream()
      expect(a.slidingWindow(3, 2)).to.emit(
        [value([1, 2]), value([1, 2, 3]), value([2, 3, 4]), value([3, 4, 5]), end()],
        () => send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.slidingWindow(3, 3) should work correctly', () => {
      const a = stream()
      expect(a.slidingWindow(3, 3)).to.emit([value([1, 2, 3]), value([2, 3, 4]), value([3, 4, 5]), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.slidingWindow(3, 4) should work correctly', () => {
      const a = stream()
      expect(a.slidingWindow(3, 4)).to.emit([end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.slidingWindow(3, 4)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().slidingWindow(1)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.slidingWindow(1)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).slidingWindow(1)).to.emit([end({current: true})]))

    it('.slidingWindow(3) should work correctly', () => {
      const a = send(prop(), [value(1)])
      expect(a.slidingWindow(3)).to.emit(
        [value([1], {current: true}), value([1, 2]), value([1, 2, 3]), value([2, 3, 4]), value([3, 4, 5]), end()],
        () => send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.slidingWindow(3, 2) should work correctly', () => {
      const a = send(prop(), [value(1)])
      expect(a.slidingWindow(3, 2)).to.emit(
        [value([1, 2]), value([1, 2, 3]), value([2, 3, 4]), value([3, 4, 5]), end()],
        () => send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.slidingWindow(3, 3) should work correctly', () => {
      const a = send(prop(), [value(1)])
      expect(a.slidingWindow(3, 3)).to.emit([value([1, 2, 3]), value([2, 3, 4]), value([3, 4, 5]), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.slidingWindow(3, 4) should work correctly', () => {
      const a = send(prop(), [value(1)])
      expect(a.slidingWindow(3, 4)).to.emit([end()], () => send(a, [value(2), value(3), value(4), value(5), end()]))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.slidingWindow(3, 4)).to.flowErrors(a)
    })
  })
})
