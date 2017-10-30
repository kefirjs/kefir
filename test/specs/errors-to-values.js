const {stream, prop, send, expect} = require('../test-helpers')

const handler = x => ({
  convert: x >= 0,
  value: x * 3,
})

describe('errorsToValues', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().errorsToValues(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.errorsToValues(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).errorsToValues(() => {})).to.emit(['<end:current>'])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.errorsToValues(handler)).to.emit([1, 6, {error: -1}, 9, 4, '<end>'], () =>
        send(a, [1, {error: 2}, {error: -1}, {error: 3}, 4, '<end>'])
      )
    })

    it('default handler should convert all errors', () => {
      const a = stream()
      expect(a.errorsToValues()).to.emit([1, 2, -1, 3, 4, '<end>'], () =>
        send(a, [1, {error: 2}, {error: -1}, {error: 3}, 4, '<end>'])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().errorsToValues(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.errorsToValues(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).errorsToValues(() => {})).to.emit(['<end:current>'])
    })

    it('should handle events', () => {
      const a = send(prop(), [1])
      expect(a.errorsToValues(handler)).to.emit([{current: 1}, 6, {error: -1}, 9, 4, '<end>'], () =>
        send(a, [{error: 2}, {error: -1}, {error: 3}, 4, '<end>'])
      )
    })

    it('should handle currents', () => {
      let a = send(prop(), [{error: -2}])
      expect(a.errorsToValues(handler)).to.emit([{currentError: -2}])
      a = send(prop(), [{error: 2}])
      expect(a.errorsToValues(handler)).to.emit([{current: 6}])
      a = send(prop(), [1])
      expect(a.errorsToValues(handler)).to.emit([{current: 1}])
    })
  })
})
