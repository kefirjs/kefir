const {stream, prop, send, Kefir} = require('../test-helpers')

describe('ignoreValues', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().ignoreValues()).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.ignoreValues()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).ignoreValues()).toEmit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.ignoreValues()).toEmit([{error: -1}, {error: -2}, '<end>'], () =>
        send(a, [1, {error: -1}, 2, {error: -2}, '<end>'])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().ignoreValues()).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.ignoreValues()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).ignoreValues()).toEmit(['<end:current>']))

    it('should handle events and current', () => {
      const a = send(prop(), [1, {error: -1}])
      expect(a.ignoreValues()).toEmit([{currentError: -1}, {error: -2}, {error: -3}, '<end>'], () =>
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      )
    })
  })
})
