const {stream, prop, send, Kefir, expect} = require('../test-helpers')

describe('ignoreErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().ignoreErrors()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.ignoreErrors()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).ignoreErrors()).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.ignoreErrors()).to.emit([1, 2, '<end>'], () => send(a, [1, {error: -1}, 2, {error: -2}, '<end>']))
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().ignoreErrors()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.ignoreErrors()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).ignoreErrors()).to.emit(['<end:current>']))

    it('should handle events and current', () => {
      let a = send(prop(), [{error: -1}])
      expect(a.ignoreErrors()).to.emit([2, 3, '<end>'], () => send(a, [2, {error: -2}, 3, {error: -3}, '<end>']))
      a = send(prop(), [1])
      expect(a.ignoreErrors()).to.emit([{current: 1}, 2, 3, '<end>'], () =>
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      )
    })
  })
})
