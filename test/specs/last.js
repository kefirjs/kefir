const {stream, prop, send, Kefir, expect} = require('../test-helpers')

describe('last', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().last()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.last()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).last()).to.emit(['<end:current>'])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.last()).to.emit([{error: 5}, {error: 6}, 3, '<end>'], () =>
        send(a, [1, {error: 5}, {error: 6}, 2, 3, '<end>'])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().last()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.last()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).last()).to.emit(['<end:current>'])
      expect(send(prop(), [1, '<end>']).last()).to.emit([{current: 1}, '<end:current>'])
    })

    it('should handle events and current', () => {
      let a = send(prop(), [1])
      expect(a.last()).to.emit([{error: 5}, 1, '<end>'], () => send(a, [{error: 5}, '<end>']))

      a = send(prop(), [{error: 0}])
      expect(a.last()).to.emit([{currentError: 0}, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
    })
  })
})
