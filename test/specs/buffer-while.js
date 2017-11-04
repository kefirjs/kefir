const {stream, prop, send, value, end, expect} = require('../test-helpers')

const not3 = x => x !== 3

describe('bufferWhile', () => {
  describe('stream', () => {
    it('should stream', () => {
      expect(stream().bufferWhile(not3)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.bufferWhile(not3)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).bufferWhile(not3)).to.emit([end({current: true})]))

    it('should work correctly', () => {
      const a = stream()
      expect(a.bufferWhile(not3)).to.emit(
        [value([3]), value([1, 2, 3]), value([4, 3]), value([3]), value([5, 6]), end()],
        () => send(a, [value(3), value(1), value(2), value(3), value(4), value(3), value(3), value(5), value(6), end()])
      )
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      const a = stream()
      expect(a.bufferWhile(not3, {flushOnEnd: false})).to.emit(
        [value([3]), value([1, 2, 3]), value([4, 3]), value([3]), end()],
        () => send(a, [value(3), value(1), value(2), value(3), value(4), value(3), value(3), value(5), value(6), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.bufferWhile(not3)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should property', () => {
      expect(prop().bufferWhile(not3)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.bufferWhile(not3)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).bufferWhile(not3)).to.emit([end({current: true})])
      expect(send(prop(), [value(3), end()]).bufferWhile(not3)).to.emit([
        value([3], {current: true}),
        end({current: true}),
      ])
      expect(send(prop(), [value(2), end()]).bufferWhile(not3)).to.emit([
        value([2], {current: true}),
        end({current: true}),
      ])
      expect(send(prop(), [value(3), end()]).bufferWhile(not3, {flushOnEnd: false})).to.emit([
        value([3], {current: true}),
        end({current: true}),
      ])
      expect(send(prop(), [value(2), end()]).bufferWhile(not3, {flushOnEnd: false})).to.emit([end({current: true})])
    })

    it('should work correctly', () => {
      let a = send(prop(), [value(3)])
      expect(a.bufferWhile(not3)).to.emit(
        [value([3], {current: true}), value([1, 2, 3]), value([4, 3]), value([3]), value([5, 6]), end()],
        () => send(a, [value(1), value(2), value(3), value(4), value(3), value(3), value(5), value(6), end()])
      )
      a = send(prop(), [value(1)])
      expect(a.bufferWhile(not3)).to.emit([value([1, 2, 3]), value([5, 6]), end()], () =>
        send(a, [value(2), value(3), value(5), value(6), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.bufferWhile(not3)).to.flowErrors(a)
    })
  })
})
