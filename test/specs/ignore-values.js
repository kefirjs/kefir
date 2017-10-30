const {stream, prop, send, Kefir, expect} = require('../test-helpers')

describe('ignoreValues', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().ignoreValues()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.ignoreValues()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).ignoreValues()).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.ignoreValues()).to.emit([{error: -1}, {error: -2}, '<end>'], () =>
        send(a, [1, {error: -1}, 2, {error: -2}, '<end>'])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().ignoreValues()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.ignoreValues()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).ignoreValues()).to.emit(['<end:current>']))

    it('should handle events and current', () => {
      const a = send(prop(), [1, {error: -1}])
      expect(a.ignoreValues()).to.emit([{currentError: -1}, {error: -2}, {error: -3}, '<end>'], () =>
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      )
    })
  })
})
