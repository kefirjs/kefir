const {stream, prop, send, shakyTimeTest} = require('../test-helpers')

describe('delay', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().delay(100)).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.delay(100)).toActivate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).delay(100)).toEmit(['<end:current>'])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.delay(100)).toEmitInTime([[100, 1], [150, 2], [250, '<end>']], tick => {
        send(a, [1])
        tick(50)
        send(a, [2])
        tick(100)
        send(a, ['<end>'])
      })
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.delay(100)).errorsToFlow(a)
    })

    // see https://github.com/rpominov/kefir/issues/134
    describe('works with undependable setTimeout', () => {
      shakyTimeTest(expectToEmitOverShakyTime => {
        const a = stream()
        expectToEmitOverShakyTime(a.delay(10), [[10, 1], [15, 4], [15, '<end>']], tick => {
          send(a, [1])
          tick(5)
          send(a, [4])
          send(a, ['<end>'])
        })
      })
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().delay(100)).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.delay(100)).toActivate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).delay(100)).toEmit(['<end:current>'])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [1])
      expect(a.delay(100)).toEmitInTime([[0, {current: 1}], [100, 2], [150, 3], [250, '<end>']], tick => {
        send(a, [2])
        tick(50)
        send(a, [3])
        tick(100)
        send(a, ['<end>'])
      })
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.delay(100)).errorsToFlow(a)
    })
  })
})
