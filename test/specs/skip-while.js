const {stream, prop, send, Kefir, expect} = require('../test-helpers')

describe('skipWhile', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().skipWhile(() => false)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.skipWhile(() => false)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).skipWhile(() => false)).to.emit(['<end:current>']))

    it('should handle events (`-> true`)', () => {
      const a = stream()
      expect(a.skipWhile(() => true)).to.emit(['<end>'], () => send(a, [1, 2, '<end>']))
    })

    it('should handle events (`-> false`)', () => {
      const a = stream()
      expect(a.skipWhile(() => false)).to.emit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, '<end>']))
    })

    it('should handle events (`(x) -> x < 3`)', () => {
      const a = stream()
      expect(a.skipWhile(x => x < 3)).to.emit([3, 4, 5, '<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']))
    })

    it('shoud use id as default predicate', () => {
      const a = stream()
      expect(a.skipWhile()).to.emit([0, 4, 5, '<end>'], () => send(a, [1, 2, 0, 4, 5, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.skipWhile()).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().skipWhile(() => false)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.skipWhile(() => false)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).skipWhile(() => false)).to.emit(['<end:current>']))

    it('should handle events and current (`-> true`)', () => {
      const a = send(prop(), [1])
      expect(a.skipWhile(() => true)).to.emit(['<end>'], () => send(a, [2, '<end>']))
    })

    it('should handle events and current (`-> false`)', () => {
      const a = send(prop(), [1])
      expect(a.skipWhile(() => false)).to.emit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, '<end>']))
    })

    it('should handle events and current (`(x) -> x < 3`)', () => {
      const a = send(prop(), [1])
      expect(a.skipWhile(x => x < 3)).to.emit([3, 4, 5, '<end>'], () => send(a, [2, 3, 4, 5, '<end>']))
    })

    it('shoud use id as default predicate', () => {
      let a = send(prop(), [1])
      expect(a.skipWhile()).to.emit([0, 4, 5, '<end>'], () => send(a, [2, 0, 4, 5, '<end>']))
      a = send(prop(), [0])
      expect(a.skipWhile()).to.emit([{current: 0}, 2, 0, 4, 5, '<end>'], () => send(a, [2, 0, 4, 5, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.skipWhile()).to.flowErrors(a)
    })
  })
})
