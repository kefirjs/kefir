/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers')

const streamWithCurrent = event => Kefir.stream(emitter => emitter.emitEvent(event))

describe('changes', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().changes()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.changes()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).changes()).toEmit(['<end:current>']))

    it('test `streamWithCurrent` helper', function() {
      expect(streamWithCurrent({type: 'value', value: 1})).toEmit([{current: 1}])
      return expect(streamWithCurrent({type: 'error', value: 1})).toEmit([{currentError: 1}])
    })

    return it('should handle events and current', function() {
      let a = streamWithCurrent({type: 'value', value: 1})
      expect(a.changes()).toEmit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
      a = streamWithCurrent({type: 'error', value: 1})
      return expect(a.changes()).toEmit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
    })
  })

  return describe('property', function() {
    it('should return stream', () => expect(prop().changes()).toBeStream())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.changes()).toActivate(a)
    })

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).changes()).toEmit(['<end:current>']))

    return it('should handle events and current', function() {
      const a = send(prop(), [1, {error: 4}])
      return expect(a.changes()).toEmit([2, {error: 5}, 3, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']))
    })
  })
})
