const {stream, prop, send, expect} = require('../test-helpers')

describe('beforeEnd', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().beforeEnd(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.beforeEnd(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).beforeEnd(() => 42)).to.emit([{current: 42}, '<end:current>'])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.beforeEnd(() => 42)).to.emit([1, 2, 42, '<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.beforeEnd(() => {})).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().beforeEnd(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.beforeEnd(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).beforeEnd(() => 42)).to.emit([{current: 42}, '<end:current>'])
      expect(send(prop(), [1, '<end>']).beforeEnd(() => 42)).to.emit([{current: 42}, '<end:current>'])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [1])
      expect(a.beforeEnd(() => 42)).to.emit([{current: 1}, 2, 3, 42, '<end>'], () => send(a, [2, 3, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.beforeEnd(() => {})).to.flowErrors(a)
    })
  })
})
