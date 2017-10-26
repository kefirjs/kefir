const {stream, prop, send, Kefir} = require('../test-helpers')

describe('map', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().map(() => {})).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.map(() => {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).map(() => {})).toEmit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.map(x => x * 2)).toEmit([2, {error: 5}, 4, '<end>'], () => send(a, [1, {error: 5}, 2, '<end>']))
    })

    it('should work with default `fn`', () => {
      const a = stream()
      expect(a.map()).toEmit([1, {error: 5}, 2, '<end>'], () => send(a, [1, {error: 5}, 2, '<end>']))
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().map(() => {})).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.map(() => {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).map(() => {})).toEmit(['<end:current>']))

    it('should handle events and current', () => {
      let a = send(prop(), [1])
      expect(a.map(x => x * 2)).toEmit([{current: 2}, 4, {error: 5}, 6, '<end>'], () =>
        send(a, [2, {error: 5}, 3, '<end>'])
      )
      a = send(prop(), [{error: 0}])
      expect(a.map(x => x * 2)).toEmit([{currentError: 0}, 4, {error: 5}, 6, '<end>'], () =>
        send(a, [2, {error: 5}, 3, '<end>'])
      )
    })
  })
})
