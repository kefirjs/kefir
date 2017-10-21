const {stream, prop, send, Kefir} = require('../test-helpers')

const streamWithCurrent = event => Kefir.stream(emitter => emitter.emitEvent(event))

describe('changes', () => {
  describe('stream', () => {
    it('should stream', () => {
      expect(stream().changes()).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.changes()).toActivate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).changes()).toEmit(['<end:current>'])
    })

    it('test `streamWithCurrent` helper', () => {
      expect(streamWithCurrent({type: 'value', value: 1})).toEmit([{current: 1}])
      expect(streamWithCurrent({type: 'error', value: 1})).toEmit([{currentError: 1}])
    })

    it('should handle events and current', () => {
      let a = streamWithCurrent({type: 'value', value: 1})
      expect(a.changes()).toEmit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
      a = streamWithCurrent({type: 'error', value: 1})
      expect(a.changes()).toEmit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
    })
  })

  describe('property', () => {
    it('should stream', () => {
      expect(prop().changes()).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.changes()).toActivate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).changes()).toEmit(['<end:current>'])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [1, {error: 4}])
      expect(a.changes()).toEmit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
    })
  })
})
