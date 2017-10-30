const {stream, prop, send, expect} = require('../test-helpers')

describe('debounce', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().debounce(100)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.debounce(100)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).debounce(100)).to.emit(['<end:current>'])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.debounce(100)).to.emitInTime([[160, 3], [360, 4], [710, 8], [710, '<end>']], tick => {
        send(a, [1])
        tick(30)
        send(a, [2])
        tick(30)
        send(a, [3])
        tick(200)
        send(a, [4])
        tick(200)
        send(a, [5])
        tick(90)
        send(a, [6])
        tick(30)
        send(a, [7])
        tick(30)
        send(a, [8, '<end>'])
      })
    })

    it('should end immediately if no value to emit later', () => {
      const a = stream()
      expect(a.debounce(100)).to.emitInTime([[100, 1], [200, '<end>']], tick => {
        send(a, [1])
        tick(200)
        send(a, ['<end>'])
      })
    })

    it('should handle events (immediate)', () => {
      const a = stream()
      expect(a.debounce(100, {immediate: true})).to.emitInTime([[0, 1], [260, 4], [460, 5], [610, '<end>']], tick => {
        send(a, [1])
        tick(30)
        send(a, [2])
        tick(30)
        send(a, [3])
        tick(200)
        send(a, [4])
        tick(200)
        send(a, [5])
        tick(90)
        send(a, [6])
        tick(30)
        send(a, [7])
        tick(30)
        send(a, [8, '<end>'])
      })
    })

    it('should end immediately if no value to emit later (immediate)', () => {
      const a = stream()
      expect(a.debounce(100, {immediate: true})).to.emitInTime([[0, 1], [0, '<end>']], tick => send(a, [1, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.debounce(100)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().debounce(100)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.debounce(100)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).debounce(100)).to.emit(['<end:current>'])
    })

    it('should be ended if source was ended (with current)', () => {
      expect(send(prop(), [1, '<end>']).debounce(100)).to.emit([{current: 1}, '<end:current>'])
    })

    it('should handle events', () => {
      const a = send(prop(), [0])
      expect(a.debounce(100)).to.emitInTime([[0, {current: 0}], [160, 3], [360, 4], [710, 8], [710, '<end>']], tick => {
        send(a, [1])
        tick(30)
        send(a, [2])
        tick(30)
        send(a, [3])
        tick(200)
        send(a, [4])
        tick(200)
        send(a, [5])
        tick(90)
        send(a, [6])
        tick(30)
        send(a, [7])
        tick(30)
        send(a, [8, '<end>'])
      })
    })

    it('should end immediately if no value to emit later', () => {
      const a = send(prop(), [0])
      expect(a.debounce(100)).to.emitInTime([[0, {current: 0}], [100, 1], [200, '<end>']], tick => {
        send(a, [1])
        tick(200)
        send(a, ['<end>'])
      })
    })

    it('should handle events (immediate)', () => {
      const a = send(prop(), [0])
      expect(a.debounce(100, {immediate: true})).to.emitInTime(
        [[0, {current: 0}], [0, 1], [260, 4], [460, 5], [610, '<end>']],
        tick => {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(200)
          send(a, [4])
          tick(200)
          send(a, [5])
          tick(90)
          send(a, [6])
          tick(30)
          send(a, [7])
          tick(30)
          send(a, [8, '<end>'])
        }
      )
    })

    it('should end immediately if no value to emit later (immediate)', () => {
      const a = send(prop(), [0])
      expect(a.debounce(100, {immediate: true})).to.emitInTime([[0, {current: 0}], [0, 1], [0, '<end>']], tick =>
        send(a, [1, '<end>'])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.debounce(100)).to.flowErrors(a)
    })
  })
})
