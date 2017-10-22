const {stream, prop, send} = require('../test-helpers')

const noop = () => {}
const minus = (prev, next) => prev - next

describe('diff', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().diff(noop, 0)).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.diff(noop, 0)).toActivate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).diff(noop, 0)).toEmit(['<end:current>'])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.diff(minus, 0)).toEmit([-1, -2, '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('works without fn argument', () => {
      const a = stream()
      expect(a.diff(null, 0)).toEmit([[0, 1], [1, 3], '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('if no seed provided uses first value as seed', () => {
      let a = stream()
      expect(a.diff(minus)).toEmit([-1, -2, '<end>'], () => send(a, [0, 1, 3, '<end>']))
      a = stream()
      expect(a.diff()).toEmit([[0, 1], [1, 3], '<end>'], () => send(a, [0, 1, 3, '<end>']))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.diff()).errorsToFlow(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().diff(noop, 0)).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.diff(noop, 0)).toActivate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).diff(noop, 0)).toEmit(['<end:current>'])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [1])
      expect(a.diff(minus, 0)).toEmit([{current: -1}, -2, -3, '<end>'], () => send(a, [3, 6, '<end>']))
    })

    it('works without fn argument', () => {
      const a = send(prop(), [1])
      expect(a.diff(null, 0)).toEmit([{current: [0, 1]}, [1, 3], [3, 6], '<end>'], () => send(a, [3, 6, '<end>']))
    })

    it('if no seed provided uses first value as seed', () => {
      let a = send(prop(), [0])
      expect(a.diff(minus)).toEmit([-1, -2, '<end>'], () => send(a, [1, 3, '<end>']))
      a = send(prop(), [0])
      expect(a.diff()).toEmit([[0, 1], [1, 3], '<end>'], () => send(a, [1, 3, '<end>']))
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.diff()).errorsToFlow(a)
    })
  })
})
