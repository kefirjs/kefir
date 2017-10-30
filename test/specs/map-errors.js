const {stream, prop, send, Kefir, expect} = require('../test-helpers')

describe('mapErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().mapErrors(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.mapErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).mapErrors(() => {})).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.mapErrors(x => x * 2)).to.emit([1, {error: -2}, 2, {error: -4}, '<end>'], () =>
        send(a, [1, {error: -1}, 2, {error: -2}, '<end>'])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().mapErrors(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.mapErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).mapErrors(() => {})).to.emit(['<end:current>']))

    it('should handle events and current', () => {
      let a = send(prop(), [1])
      expect(a.mapErrors(x => x * 2)).to.emit([{current: 1}, 2, {error: -4}, 3, {error: -6}, '<end>'], () =>
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      )
      a = send(prop(), [{error: -1}])
      expect(a.mapErrors(x => x * 2)).to.emit([{currentError: -2}, 2, {error: -4}, 3, {error: -6}, '<end>'], () =>
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      )
    })
  })
})
