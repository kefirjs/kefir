const {stream, prop, send, expect} = require('../test-helpers')

const not3 = x => x !== 3

describe('bufferWhile', () => {
  describe('stream', () => {
    it('should stream', () => {
      expect(stream().bufferWhile(not3)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.bufferWhile(not3)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).bufferWhile(not3)).to.emit(['<end:current>']))

    it('should work correctly', () => {
      const a = stream()
      expect(a.bufferWhile(not3)).to.emit([[3], [1, 2, 3], [4, 3], [3], [5, 6], '<end>'], () =>
        send(a, [3, 1, 2, 3, 4, 3, 3, 5, 6, '<end>'])
      )
    })

    it('should not flush buffer on end if {flushOnEnd: false}', () => {
      const a = stream()
      expect(a.bufferWhile(not3, {flushOnEnd: false})).to.emit([[3], [1, 2, 3], [4, 3], [3], '<end>'], () =>
        send(a, [3, 1, 2, 3, 4, 3, 3, 5, 6, '<end>'])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.bufferWhile(not3)).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should property', () => {
      expect(prop().bufferWhile(not3)).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.bufferWhile(not3)).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).bufferWhile(not3)).to.emit(['<end:current>'])
      expect(send(prop(), [3, '<end>']).bufferWhile(not3)).to.emit([{current: [3]}, '<end:current>'])
      expect(send(prop(), [2, '<end>']).bufferWhile(not3)).to.emit([{current: [2]}, '<end:current>'])
      expect(send(prop(), [3, '<end>']).bufferWhile(not3, {flushOnEnd: false})).to.emit([
        {current: [3]},
        '<end:current>',
      ])
      expect(send(prop(), [2, '<end>']).bufferWhile(not3, {flushOnEnd: false})).to.emit(['<end:current>'])
    })

    it('should work correctly', () => {
      let a = send(prop(), [3])
      expect(a.bufferWhile(not3)).to.emit([{current: [3]}, [1, 2, 3], [4, 3], [3], [5, 6], '<end>'], () =>
        send(a, [1, 2, 3, 4, 3, 3, 5, 6, '<end>'])
      )
      a = send(prop(), [1])
      expect(a.bufferWhile(not3)).to.emit([[1, 2, 3], [5, 6], '<end>'], () => send(a, [2, 3, 5, 6, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.bufferWhile(not3)).to.flowErrors(a)
    })
  })
})
