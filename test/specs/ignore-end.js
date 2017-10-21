const {stream, prop, send} = require('../test-helpers')

describe('ignoreEnd', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().ignoreEnd()).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.ignoreEnd()).toActivate(a)
    })

    it('should not be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).ignoreEnd()).toEmit([])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.ignoreEnd()).toEmit([1, 2], () => send(a, [1, 2, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.ignoreEnd()).errorsToFlow(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().ignoreEnd()).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.ignoreEnd()).toActivate(a)
    })

    it('should not be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).ignoreEnd()).toEmit([])
      expect(send(prop(), [1, '<end>']).ignoreEnd()).toEmit([{current: 1}])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [1])
      expect(a.ignoreEnd()).toEmit([{current: 1}, 2, 3], () => send(a, [2, 3, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.ignoreEnd()).errorsToFlow(a)
    })
  })
})
