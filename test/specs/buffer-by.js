const {stream, prop, send, value, end, expect} = require('../test-helpers')

describe('bufferBy', () => {
  describe('common', () => {
    it('should activate/deactivate sources', () => {
      let a = stream()
      let b = stream()
      expect(a.bufferBy(b)).to.activate(a, b)
      a = stream()
      b = prop()
      expect(a.bufferBy(b)).to.activate(a, b)
      a = prop()
      b = stream()
      expect(a.bufferBy(b)).to.activate(a, b)
      a = prop()
      b = prop()
      expect(a.bufferBy(b)).to.activate(a, b)
    })

    it('should end when primary ends', () => {
      expect(send(stream(), [end()]).bufferBy(stream())).to.emit([value([], {current: true}), end({current: true})])
      const a = stream()
      const b = stream()
      expect(a.bufferBy(b)).to.emit([value([]), end()], () => send(a, [end()]))
    })

    it('should flush buffer on end', () => {
      expect(send(prop(), [value(1), end()]).bufferBy(stream())).to.emit([
        value([1], {current: true}),
        end({current: true}),
      ])
      const a = stream()
      const b = stream()
      expect(a.bufferBy(b)).to.emit([value([1, 2]), end()], () => send(a, [value(1), value(2), end()]))
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      expect(send(prop(), [value(1), end()]).bufferBy(stream(), {flushOnEnd: false})).to.emit([end({current: true})])
      const a = stream()
      const b = stream()
      expect(a.bufferBy(b, {flushOnEnd: false})).to.emit([end()], () => send(a, [value(1), value(2), end()]))
    })

    it('should not end when secondary ends', () => {
      expect(stream().bufferBy(send(stream(), [end()]))).to.emit([])
      const a = stream()
      const b = stream()
      expect(a.bufferBy(b)).to.emit([], () => send(b, [end()]))
    })

    it('should do end when secondary ends if {flushOnEnd: false}', () => {
      expect(stream().bufferBy(send(stream(), [end()]), {flushOnEnd: false})).to.emit([end({current: true})])
      const a = stream()
      const b = stream()
      expect(a.bufferBy(b, {flushOnEnd: false})).to.emit([end()], () => send(b, [end()]))
    })

    it('should flush buffer on each value from secondary', () => {
      const a = stream()
      const b = stream()
      expect(a.bufferBy(b)).to.emit([value([]), value([1, 2]), value([]), value([3])], () => {
        send(b, [value(0)])
        send(a, [value(1), value(2)])
        send(b, [value(0)])
        send(b, [value(0)])
        send(a, [value(3)])
        send(b, [value(0)])
        send(a, [value(4)])
      })
    })

    it('errors should flow', () => {
      let a = stream()
      let b = stream()
      expect(a.bufferBy(b)).to.flowErrors(a)
      a = stream()
      b = stream()
      expect(a.bufferBy(b)).to.flowErrors(b)
      a = prop()
      b = stream()
      expect(a.bufferBy(b)).to.flowErrors(a)
      a = prop()
      b = stream()
      expect(a.bufferBy(b)).to.flowErrors(b)
      a = stream()
      b = prop()
      expect(a.bufferBy(b)).to.flowErrors(a)
      a = stream()
      b = prop()
      expect(a.bufferBy(b)).to.flowErrors(b)
      a = prop()
      b = prop()
      expect(a.bufferBy(b)).to.flowErrors(a)
      a = prop()
      b = prop()
      expect(a.bufferBy(b)).to.flowErrors(b)
    })
  })

  describe('stream + stream', () => {
    it('returns stream', () => {
      expect(stream().bufferBy(stream())).to.be.observable.stream()
    })
  })

  describe('stream + property', () => {
    it('returns stream', () => {
      expect(stream().bufferBy(prop())).to.be.observable.stream()
    })
  })

  describe('property + stream', () => {
    it('returns property', () => {
      expect(prop().bufferBy(stream())).to.be.observable.property()
    })

    it('includes current to buffer', () => {
      const a = send(prop(), [value(1)])
      const b = stream()
      expect(a.bufferBy(b)).to.emit([value([1])], () => send(b, [value(0)]))
    })
  })

  describe('property + property', () => {
    it('returns property', () => {
      expect(prop().bufferBy(prop())).to.be.observable.property()
    })

    it('both have current', () => {
      const a = send(prop(), [value(1)])
      const b = send(prop(), [value(2)])
      expect(a.bufferBy(b)).to.emit([value([1], {current: true})])
    })
  })
})
