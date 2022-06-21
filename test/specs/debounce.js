const {stream, prop, send, value, end, expect, pool} = require('../test-helpers')

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
      expect(send(stream(), [end()]).debounce(100)).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.debounce(100)).to.emitInTime(
        [
          [160, value(3)],
          [360, value(4)],
          [710, value(8)],
          [710, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(200)
          send(a, [value(4)])
          tick(200)
          send(a, [value(5)])
          tick(90)
          send(a, [value(6)])
          tick(30)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8), end()])
        }
      )
    })

    it('should end immediately if no value to emit later', () => {
      const a = stream()
      expect(a.debounce(100)).to.emitInTime(
        [
          [100, value(1)],
          [200, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(200)
          send(a, [end()])
        }
      )
    })

    it('should handle events (immediate)', () => {
      const a = stream()
      expect(a.debounce(100, {immediate: true})).to.emitInTime(
        [
          [0, value(1)],
          [260, value(4)],
          [460, value(5)],
          [610, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(200)
          send(a, [value(4)])
          tick(200)
          send(a, [value(5)])
          tick(90)
          send(a, [value(6)])
          tick(30)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8), end()])
        }
      )
    })

    it('should handle synchronous emits when flushing events', () => {
      const a = pool()
      const b = a.debounce(100)
      a.plug(b.filter(v => v === 1).map(() => 2))

      expect(b).to.emitInTime(
        [
          [100, value(1)],
          [200, value(2)],
        ],
        () => {
          send(a, [value(1)])
        }
      )
    })

    it('should end immediately if no value to emit later (immediate)', () => {
      const a = stream()
      expect(a.debounce(100, {immediate: true})).to.emitInTime(
        [
          [0, value(1)],
          [0, end()],
        ],
        tick => send(a, [value(1), end()])
      )
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
      expect(send(prop(), [end()]).debounce(100)).to.emit([end({current: true})])
    })

    it('should be ended if source was ended (with current)', () => {
      expect(send(prop(), [value(1), end()]).debounce(100)).to.emit([value(1, {current: true}), end({current: true})])
    })

    it('should handle events', () => {
      const a = send(prop(), [value(0)])
      expect(a.debounce(100)).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [160, value(3)],
          [360, value(4)],
          [710, value(8)],
          [710, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(200)
          send(a, [value(4)])
          tick(200)
          send(a, [value(5)])
          tick(90)
          send(a, [value(6)])
          tick(30)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8), end()])
        }
      )
    })

    it('should end immediately if no value to emit later', () => {
      const a = send(prop(), [value(0)])
      expect(a.debounce(100)).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [100, value(1)],
          [200, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(200)
          send(a, [end()])
        }
      )
    })

    it('should handle events (immediate)', () => {
      const a = send(prop(), [value(0)])
      expect(a.debounce(100, {immediate: true})).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [0, value(1)],
          [260, value(4)],
          [460, value(5)],
          [610, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(30)
          send(a, [value(2)])
          tick(30)
          send(a, [value(3)])
          tick(200)
          send(a, [value(4)])
          tick(200)
          send(a, [value(5)])
          tick(90)
          send(a, [value(6)])
          tick(30)
          send(a, [value(7)])
          tick(30)
          send(a, [value(8), end()])
        }
      )
    })

    it('should end immediately if no value to emit later (immediate)', () => {
      const a = send(prop(), [value(0)])
      expect(a.debounce(100, {immediate: true})).to.emitInTime(
        [
          [0, value(0, {current: true})],
          [0, value(1)],
          [0, end()],
        ],
        tick => send(a, [value(1), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.debounce(100)).to.flowErrors(a)
    })
  })
})
