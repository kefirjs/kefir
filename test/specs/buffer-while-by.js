const {stream, prop, send, expect} = require('../test-helpers')

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
      expect(send(stream(), ['<end>']).bufferWhileBy(stream())).to.emit([{current: []}, '<end:current>'])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([[], '<end>'], () => send(a, ['<end>']))
    })

    it('should flush empty buffer when secondary emits false (w/ {flushOnChange: true})', () => {
      expect(stream().bufferWhileBy(send(prop(), [false]), {flushOnChange: true})).to.emit([{current: []}])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnChange: true})).to.emit([[]], () => send(b, [true, false]))
    })

    it('should flush buffer on end', () => {
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream())).to.emit([{current: [1]}, '<end:current>'])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([[1, 2], '<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream(), {flushOnEnd: false})).to.emit(['<end:current>'])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit(['<end>'], () => send(a, [1, 2, '<end>']))
    })

    it("should end when secondary ends, if it haven't emitted any value (w/ {flushOnEnd: false})", () => {
      expect(stream().bufferWhileBy(send(stream(), ['<end>']), {flushOnEnd: false})).to.emit(['<end:current>'])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit(['<end>'], () => send(b, ['<end>']))
    })

    it('should end when secondary ends, if its last emitted value was truthy (w/ {flushOnEnd: false})', () => {
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']), {flushOnEnd: false})).to.emit(['<end:current>'])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit(['<end>'], () => send(b, [true, '<end>']))
    })

    it('should not end when secondary ends, if its last emitted value was falsy (w/ {flushOnEnd: false})', () => {
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']), {flushOnEnd: false})).to.emit([])
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).to.emit([], () => send(b, [false, '<end>']))
    })

    it('should not end when secondary ends (w/o {flushOnEnd: false})', () => {
      expect(stream().bufferWhileBy(send(prop(), ['<end>']))).to.emit([])
      let a = stream()
      let b = stream()
      expect(a.bufferWhileBy(b)).to.emit([], () => send(b, ['<end>']))
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']))).to.emit([])
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).to.emit([], () => send(b, [true, '<end>']))
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']))).to.emit([])
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).to.emit([], () => send(b, [false, '<end>']))
    })

    it('should flush buffer on each value from primary if last value form secondary was falsy', () => {
      const a = stream()
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([[1, 2, 3, 4], [5], [6, 7, 8]], () => {
        send(a, [1, 2]) // buffering
        send(b, [true])
        send(a, [3]) // still buffering
        send(b, [false])
        send(a, [4]) // flushing 1,2,3,4
        send(a, [5]) // flushing 5
        send(b, [true])
        send(a, [6, 7]) // buffering again
        send(b, [false])
        send(a, [8])
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
      expect(a.bufferWhileBy(b, {flushOnChange: true})).to.emit([[1, 2, 3]], () => {
        send(a, [1, 2]) // buffering
        send(b, [true])
        send(a, [3]) // still buffering
        send(b, [false])
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
      const a = send(prop(), [1])
      const b = stream()
      expect(a.bufferWhileBy(b)).to.emit([[1, 2]], () => {
        send(b, [false])
        send(a, [2])
      })
    })
  })

  describe('property + property', () => {
    it('returns property', () => {
      expect(prop().bufferWhileBy(prop())).to.be.observable.property()
    })

    it('both have current', () => {
      let a = send(prop(), [1])
      let b = send(prop(), [false])
      expect(a.bufferWhileBy(b)).to.emit([{current: [1]}])
      a = send(prop(), [1])
      b = send(prop(), [true])
      expect(a.bufferWhileBy(b)).to.emit([])
    })
  })
})
