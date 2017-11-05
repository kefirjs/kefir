const {stream, prop, send, value, end, expect} = require('../test-helpers')

describe('bufferWithCount', () => {
  describe('stream', () => {
    it('should stream', () => {
      expect(stream().bufferWithCount(1)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.bufferWithCount(1)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).bufferWithCount(1)).to.emit([end({current: true})])
    })

    it('.bufferWithCount(1) should work correctly', () => {
      const a = stream()
      expect(a.bufferWithCount(1)).to.emit([value([1]), value([2]), value([3]), value([4]), value([5]), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.bufferWithCount(2) should work correctly', () => {
      const a = stream()
      expect(a.bufferWithCount(2)).to.emit([value([1, 2]), value([3, 4]), value([5]), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.bufferWithCount(3) should work correctly', () => {
      const a = stream()
      expect(a.bufferWithCount(3)).to.emit([value([1, 2, 3]), value([4, 5]), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      const a = stream()
      expect(a.bufferWithCount(3, {flushOnEnd: false})).to.emit([value([1, 2, 3]), end()], () =>
        send(a, [value(1), value(2), value(3), value(4), value(5), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.bufferWithCount(3)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should property', () => {
      expect(prop().bufferWithCount(1)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.bufferWithCount(1)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).bufferWithCount(1)).to.emit([end({current: true})])
    })

    it('.bufferWithCount(1) should work correctly', () => {
      const a = send(prop(), [value(1)])
      expect(a.bufferWithCount(1)).to.emit(
        [value([1], {current: true}), value([2]), value([3]), value([4]), value([5]), end()],
        () => send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.bufferWithCount(2) should work correctly', () => {
      const a = send(prop(), [value(1)])
      expect(a.bufferWithCount(2)).to.emit([value([1, 2]), value([3, 4]), value([5]), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('.bufferWithCount(3) should work correctly', () => {
      const a = send(prop(), [value(1)])
      expect(a.bufferWithCount(3)).to.emit([value([1, 2, 3]), value([4, 5]), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      const a = send(prop(), [value(1)])
      expect(a.bufferWithCount(3, {flushOnEnd: false})).to.emit([value([1, 2, 3]), end()], () =>
        send(a, [value(2), value(3), value(4), value(5), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.bufferWithCount(3)).to.flowErrors(a)
    })
  })
})
