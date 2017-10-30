const {stream, prop, send, Kefir, expect} = require('../test-helpers')

const handler = x => ({
  convert: x < 0,
  error: x * 3,
})

describe('valuesToErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().valuesToErrors(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.valuesToErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).valuesToErrors(() => {})).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.valuesToErrors(handler)).to.emit([1, {error: -6}, {error: -3}, {error: -12}, 5, '<end>'], () =>
        send(a, [1, -2, {error: -3}, -4, 5, '<end>'])
      )
    })

    it('default handler should convert all values', () => {
      const a = stream()
      expect(a.valuesToErrors()).to.emit([{error: 1}, {error: -2}, {error: -3}, {error: -4}, {error: 5}, '<end>'], () =>
        send(a, [1, -2, {error: -3}, -4, 5, '<end>'])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().valuesToErrors(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.valuesToErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).valuesToErrors(() => {})).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = send(prop(), [1])
      expect(a.valuesToErrors(handler)).to.emit(
        [{current: 1}, {error: -6}, {error: -3}, {error: -12}, 5, '<end>'],
        () => send(a, [-2, {error: -3}, -4, 5, '<end>'])
      )
    })

    it('should handle currents', () => {
      let a = send(prop(), [2])
      expect(a.valuesToErrors(handler)).to.emit([{current: 2}])
      a = send(prop(), [-2])
      expect(a.valuesToErrors(handler)).to.emit([{currentError: -6}])
      a = send(prop(), [{error: -2}])
      expect(a.valuesToErrors(handler)).to.emit([{currentError: -2}])
    })
  })
})
