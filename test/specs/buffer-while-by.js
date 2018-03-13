const {stream, prop, send, value, end, expect} = require('../test-helpers')

describe('bufferWhileBy', () => {
  describe('common', () => {
    it('should activate/deactivate sources', () => {
      let a = stream()
      let b = stream()
      expect(a.bufferWhileBy(b)).to.activate(a, b)
      a = stream()
      b = prop()
      expect(a.bufferWhileBy(b)).to.activate(a, b)
      a = prop()
      b = stream()
      expect(a.bufferWhileBy(b)).to.activate(a, b)
      a = prop()
      b = prop()
      expect(a.bufferWhileBy(b)).to.activate(a, b)
    })

    it('should flush empty buffer and then end when primary ends', () => {
      expect(send(stream(), [end()]).bufferWhileBy(stream())).to.emit([
        value([], {current: true}),
        end({current: true}),
      ])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([value([]), end()], () => send(a, [end()]))
    })

    it('should flush empty buffer when secondary emits false (w/ {flushOnChange: true})', () => {
      expect(stream().bufferWhileBy(send(prop(), [value(false)]), {flushOnChange: true})).to.emit([
        value([], {current: true}),
      ])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnChange: true})).to.emit([value([])], () => send(b, [value(true), value(false)]))
    })

    it('should flush buffer on end', () => {
      expect(send(prop(), [value(1), end()]).bufferWhileBy(stream())).to.emit([
        value([1], {current: true}),
        end({current: true}),
      ])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([value([1, 2]), end()], () => send(a, [value(1), value(2), end()]))
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      expect(send(prop(), [value(1), end()]).bufferWhileBy(stream(), {flushOnEnd: false})).to.emit([
        end({current: true}),
      ])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit([end()], () => send(a, [value(1), value(2), end()]))
    })

    it("should end when secondary ends, if it haven't emitted any value (w/ {flushOnEnd: false})", () => {
      expect(stream().bufferWhileBy(send(stream(), [end()]), {flushOnEnd: false})).to.emit([end({current: true})])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit([end()], () => send(b, [end()]))
    })

    it('should end when secondary ends, if its last emitted value was truthy (w/ {flushOnEnd: false})', () => {
      expect(stream().bufferWhileBy(send(prop(), [value(true), end()]), {flushOnEnd: false})).to.emit([
        end({current: true}),
      ])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit([end()], () => send(b, [value(true), end()]))
    })

    it('should not end when secondary ends, if its last emitted value was falsy (w/ {flushOnEnd: false})', () => {
      expect(stream().bufferWhileBy(send(prop(), [value(false), end()]), {flushOnEnd: false})).to.emit([])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit([], () => send(b, [value(false), end()]))
    })

    it('should not end when secondary ends (w/o {flushOnEnd: false})', () => {
      expect(stream().bufferWhileBy(send(prop(), [end()]))).to.emit([])
      let a = stream()
      let b = stream()
      expect(a.bufferWhileBy(b)).to.emit([], () => send(b, [end()]))
      expect(stream().bufferWhileBy(send(prop(), [value(true), end()]))).to.emit([])
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).to.emit([], () => send(b, [value(true), end()]))
      expect(stream().bufferWhileBy(send(prop(), [value(false), end()]))).to.emit([])
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).to.emit([], () => send(b, [value(false), end()]))
    })

    it('should flush buffer on each value from primary if last value form secondary was falsy', () => {
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([value([1, 2, 3, 4]), value([5]), value([6, 7, 8])], () => {
        send(a, [value(1), value(2)]) // buffering
        send(b, [value(true)])
        send(a, [value(3)]) // still buffering
        send(b, [value(false)])
        send(a, [value(4)]) // flushing 1,2,3,4
        send(a, [value(5)]) // flushing 5
        send(b, [value(true)])
        send(a, [value(6), value(7)]) // buffering again
        send(b, [value(false)])
        send(a, [value(8)])
      })
    }) // flushing 6,7,8

    it('errors should flow', () => {
      let a = stream()
      let b = stream()
      expect(a.bufferWhileBy(b)).to.flowErrors(a)
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).to.flowErrors(b)
      a = prop()
      b = stream()
      expect(a.bufferWhileBy(b)).to.flowErrors(a)
      a = prop()
      b = stream()
      expect(a.bufferWhileBy(b)).to.flowErrors(b)
      a = stream()
      b = prop()
      expect(a.bufferWhileBy(b)).to.flowErrors(a)
      a = stream()
      b = prop()
      expect(a.bufferWhileBy(b)).to.flowErrors(b)
      a = prop()
      b = prop()
      expect(a.bufferWhileBy(b)).to.flowErrors(a)
      a = prop()
      b = prop()
      expect(a.bufferWhileBy(b)).to.flowErrors(b)
    })

    it('should flush on change if {flushOnChange === true}', () => {
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnChange: true})).to.emit([value([1, 2, 3])], () => {
        send(a, [value(1), value(2)]) // buffering
        send(b, [value(true)])
        send(a, [value(3)]) // still buffering
        send(b, [value(false)])
      })
    })
  }) // flush

  describe('stream + stream', () => {
    it('returns stream', () => {
      expect(stream().bufferWhileBy(stream())).to.be.observable.stream()
    })
  })

  describe('stream + property', () => {
    it('returns stream', () => {
      expect(stream().bufferWhileBy(prop())).to.be.observable.stream()
    })
  })

  describe('property + stream', () => {
    it('returns property', () => {
      expect(prop().bufferWhileBy(stream())).to.be.observable.property()
    })

    it('includes current to buffer', () => {
      const a = send(prop(), [value(1)])
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([value([1, 2])], () => {
        send(b, [value(false)])
        send(a, [value(2)])
      })
    })
  })

  describe('property + property', () => {
    it('returns property', () => {
      expect(prop().bufferWhileBy(prop())).to.be.observable.property()
    })

    it('both have current', () => {
      let a = send(prop(), [value(1)])
      let b = send(prop(), [value(false)])
      expect(a.bufferWhileBy(b)).to.emit([value([1], {current: true})])
      a = send(prop(), [value(1)])
      b = send(prop(), [value(true)])
      expect(a.bufferWhileBy(b)).to.emit([])
    })
  })
})
