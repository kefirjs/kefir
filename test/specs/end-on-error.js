const {stream, prop, send, expect} = require('../test-helpers')

describe('endOnError', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().endOnError()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.endOnError()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).endOnError()).to.emit(['<end:current>'])
    })

    it('should handle events', () => {
      let a = stream()
      expect(a.endOnError()).to.emit([1, {error: 5}, '<end>'], () => send(a, [1, {error: 5}, 2]))
      a = stream()
      expect(a.endOnError()).to.emit([1, 2, '<end>'], () => send(a, [1, 2, '<end>']))
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().endOnError()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.endOnError()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).endOnError()).to.emit(['<end:current>'])
    })

    it('should handle events and current', () => {
      let a = send(prop(), [1])
      expect(a.endOnError()).to.emit([{current: 1}, {error: 5}, '<end>'], () => send(a, [{error: 5}, 2]))
      a = send(prop(), [1])
      expect(a.endOnError()).to.emit([{current: 1}, 2, '<end>'], () => send(a, [2, '<end>']))
    })

    it('should handle currents', () => {
      let a = send(prop(), [{error: -1}])
      expect(a.endOnError()).to.emit([{currentError: -1}, '<end:current>'])
      a = send(prop(), [{error: -1}, '<end>'])
      expect(a.endOnError()).to.emit([{currentError: -1}, '<end:current>'])
      a = send(prop(), [1])
      expect(a.endOnError()).to.emit([{current: 1}])
      a = send(prop(), [1, '<end>'])
      expect(a.endOnError()).to.emit([{current: 1}, '<end:current>'])
    })
  })
})
