const {stream, prop, send, Kefir} = require('../test-helpers')

describe('skipDuplicates', () => {
  const roundlyEqual = (a, b) => Math.round(a) === Math.round(b)

  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().skipDuplicates()).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.skipDuplicates()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).skipDuplicates()).toEmit(['<end:current>']))

    it('should handle events (default comparator)', () => {
      const a = stream()
      expect(a.skipDuplicates()).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 1, 2, 3, 3, '<end>']))
    })

    it('should handle events (custom comparator)', () => {
      const a = stream()
      expect(a.skipDuplicates(roundlyEqual)).toEmit([1, 2, 3.8, '<end>'], () => send(a, [1, 1.1, 2, 3.8, 4, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.skipDuplicates()).errorsToFlow(a)
    })

    it('should help with creating circular dependencies', () => {
      // https://github.com/rpominov/kefir/issues/42

      const a = stream()
      const b = Kefir.pool()
      b.plug(a)
      b.plug(b.map(x => x).skipDuplicates())
      expect(b).toEmit([1, 1], () => send(a, [1]))
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().skipDuplicates()).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.skipDuplicates()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).skipDuplicates()).toEmit(['<end:current>']))

    it('should handle events and current (default comparator)', () => {
      const a = send(prop(), [1])
      expect(a.skipDuplicates()).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [1, 1, 2, 3, 3, '<end>']))
    })

    it('should handle events and current (custom comparator)', () => {
      const a = send(prop(), [1])
      expect(a.skipDuplicates(roundlyEqual)).toEmit([{current: 1}, 2, 3, '<end>'], () =>
        send(a, [1.1, 1.2, 2, 3, 3.2, '<end>'])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.skipDuplicates()).errorsToFlow(a)
    })
  })
})
