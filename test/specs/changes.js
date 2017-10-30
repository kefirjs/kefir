const {stream, prop, send, Kefir, expect} = require('../test-helpers')

const streamWithCurrent = event => Kefir.stream(emitter => emitter.emitEvent(event))

describe('changes', () => {
  describe('stream', () => {
    it('should stream', () => {
      expect(stream().changes()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.changes()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), ['<end>']).changes()).to.emit(['<end:current>'])
    })

    it('test `streamWithCurrent` helper', () => {
      expect(streamWithCurrent({type: 'value', value: 1})).to.emit([{current: 1}])
      expect(streamWithCurrent({type: 'error', value: 1})).to.emit([{currentError: 1}])
    })

    it('should handle events and current', () => {
      let a = streamWithCurrent({type: 'value', value: 1})
      expect(a.changes()).to.emit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
      a = streamWithCurrent({type: 'error', value: 1})
      expect(a.changes()).to.emit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
    })
  })

  describe('property', () => {
    it('should stream', () => {
      expect(prop().changes()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.changes()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), ['<end>']).changes()).to.emit(['<end:current>'])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [1, {error: 4}])
      expect(a.changes()).to.emit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
    })
  })
})
