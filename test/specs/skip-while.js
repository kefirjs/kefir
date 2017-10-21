const {stream, prop, send, Kefir} = require('../test-helpers')

describe('skipWhile', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().skipWhile(() => false)).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.skipWhile(() => false)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).skipWhile(() => false)).toEmit(['<end:current>']))

    it('should handle events (`-> true`)', () => {
      const a = stream()
      expect(a.skipWhile(() => true)).toEmit(['<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('should handle events (`-> false`)', () => {
      const a = stream()
      expect(a.skipWhile(() => false)).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, '<end>']))
    })

    it('should handle events (`(x) -> x < 3`)', () => {
      const a = stream()
      expect(a.skipWhile(x => x < 3)).toEmit([3, 4, 5, '<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']))
    })

    it('shoud use id as default predicate', () => {
      const a = stream()
      expect(a.skipWhile()).toEmit([0, 4, 5, '<end>'], () => send(a, [1, 2, 0, 4, 5, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.skipWhile()).errorsToFlow(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().skipWhile(() => false)).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.skipWhile(() => false)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).skipWhile(() => false)).toEmit(['<end:current>']))

    it('should handle events and current (`-> true`)', () => {
      const a = send(prop(), [1])
      expect(a.skipWhile(() => true)).toEmit(['<end>'], () => send(a, [2, '<end>']))
    })

    it('should handle events and current (`-> false`)', () => {
      const a = send(prop(), [1])
      expect(a.skipWhile(() => false)).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, '<end>']))
    })

    it('should handle events and current (`(x) -> x < 3`)', () => {
      const a = send(prop(), [1])
      expect(a.skipWhile(x => x < 3)).toEmit([3, 4, 5, '<end>'], () => send(a, [2, 3, 4, 5, '<end>']))
    })

    it('shoud use id as default predicate', () => {
      let a = send(prop(), [1])
      expect(a.skipWhile()).toEmit([0, 4, 5, '<end>'], () => send(a, [2, 0, 4, 5, '<end>']))
      a = send(prop(), [0])
      expect(a.skipWhile()).toEmit([{current: 0}, 2, 0, 4, 5, '<end>'], () => send(a, [2, 0, 4, 5, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.skipWhile()).errorsToFlow(a)
    })
  })
})
