const {stream, prop, send, value, end, shakyTimeTest, expect} = require('../test-helpers')

describe('delay', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().delay(100)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.delay(100)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).delay(100)).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.delay(100)).to.emitInTime(
        [
          [100, value(1)],
          [150, value(2)],
          [250, end()],
        ],
        tick => {
          send(a, [value(1)])
          tick(50)
          send(a, [value(2)])
          tick(100)
          send(a, [end()])
        }
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.delay(100)).to.flowErrors(a)
    })

    // see https://github.com/kefirjs/kefir/issues/134
    describe('works with undependable setTimeout', () => {
      shakyTimeTest(expectToEmitOverShakyTime => {
        const a = stream()
        expectToEmitOverShakyTime(
          a.delay(10),
          [
            [10, value(1)],
            [15, value(4)],
            [15, end()],
          ],
          tick => {
            send(a, [value(1)])
            tick(5)
            send(a, [value(4)])
            send(a, [end()])
          }
        )
      })
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().delay(100)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.delay(100)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).delay(100)).to.emit([end({current: true})])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [value(1)])
      expect(a.delay(100)).to.emitInTime(
        [
          [0, value(1, {current: true})],
          [100, value(2)],
          [150, value(3)],
          [250, end()],
        ],
        tick => {
          send(a, [value(2)])
          tick(50)
          send(a, [value(3)])
          tick(100)
          send(a, [end()])
        }
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.delay(100)).to.flowErrors(a)
    })
  })
})
