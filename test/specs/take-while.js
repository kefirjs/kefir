const {stream, prop, send, Kefir} = require('../test-helpers')

describe('takeWhile', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().takeWhile(() => true)).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.takeWhile(() => true)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).takeWhile(() => true)).toEmit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.takeWhile(x => x < 4)).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']))
    })

    it('should handle events (natural end)', () => {
      const a = stream()
      expect(a.takeWhile(x => x < 4)).toEmit([1, 2, '<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('should handle events (with `-> false`)', () => {
      const a = stream()
      expect(a.takeWhile(() => false)).toEmit(['<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('shoud use id as default predicate', () => {
      const a = stream()
      expect(a.takeWhile()).toEmit([1, 2, '<end>'], () => send(a, [1, 2, 0, 5, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.takeWhile()).errorsToFlow(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().takeWhile(() => true)).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.takeWhile(() => true)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).takeWhile(() => true)).toEmit(['<end:current>']))

    it('should be ended if calback was `-> false` and source has a current', () =>
      expect(send(prop(), [1]).takeWhile(() => false)).toEmit(['<end:current>']))

    it('should handle events', () => {
      const a = send(prop(), [1])
      expect(a.takeWhile(x => x < 4)).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, 4, 5, '<end>']))
    })

    it('should handle events (natural end)', () => {
      const a = send(prop(), [1])
      expect(a.takeWhile(x => x < 4)).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, '<end>']))
    })

    it('should handle events (with `-> false`)', () => {
      const a = prop()
      expect(a.takeWhile(() => false)).toEmit(['<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('shoud use id as default predicate', () => {
      let a = send(prop(), [1])
      expect(a.takeWhile()).toEmit([{current: 1}, 2, '<end>'], () => send(a, [2, 0, 5, '<end>']))
      a = send(prop(), [0])
      expect(a.takeWhile()).toEmit(['<end:current>'], () => send(a, [2, 0, 5, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.takeWhile()).errorsToFlow(a)
    })
  })
})
