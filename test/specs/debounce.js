/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

describe('debounce', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().debounce(100)).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.debounce(100)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).debounce(100)).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.debounce(100)).toEmitInTime([[160, 3], [360, 4], [710, 8], [710, '<end>']], function(tick) {
        send(a, [1])
        tick(30)
        send(a, [2])
        tick(30)
        send(a, [3])
        tick(200)
        send(a, [4])
        tick(200)
        send(a, [5])
        tick(90)
        send(a, [6])
        tick(30)
        send(a, [7])
        tick(30)
        return send(a, [8, '<end>'])
      })
    })

    it('should end immediately if no value to emit later', function() {
      const a = stream()
      return expect(a.debounce(100)).toEmitInTime([[100, 1], [200, '<end>']], function(tick) {
        send(a, [1])
        tick(200)
        return send(a, ['<end>'])
      })
    })

    it('should handle events (immediate)', function() {
      const a = stream()
      return expect(a.debounce(100, {immediate: true})).toEmitInTime(
        [[0, 1], [260, 4], [460, 5], [610, '<end>']],
        function(tick) {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(200)
          send(a, [4])
          tick(200)
          send(a, [5])
          tick(90)
          send(a, [6])
          tick(30)
          send(a, [7])
          tick(30)
          return send(a, [8, '<end>'])
        }
      )
    })

    it('should end immediately if no value to emit later (immediate)', function() {
      const a = stream()
      return expect(a.debounce(100, {immediate: true})).toEmitInTime([[0, 1], [0, '<end>']], tick =>
        send(a, [1, '<end>'])
      )
    })

    return it('errors should flow', function() {
      const a = stream()
      return expect(a.debounce(100)).errorsToFlow(a)
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().debounce(100)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.debounce(100)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).debounce(100)).toEmit(['<end:current>']))

    it('should be ended if source was ended (with current)', () =>
      expect(send(prop(), [1, '<end>']).debounce(100)).toEmit([{current: 1}, '<end:current>']))

    it('should handle events', function() {
      const a = send(prop(), [0])
      return expect(a.debounce(100)).toEmitInTime(
        [[0, {current: 0}], [160, 3], [360, 4], [710, 8], [710, '<end>']],
        function(tick) {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(200)
          send(a, [4])
          tick(200)
          send(a, [5])
          tick(90)
          send(a, [6])
          tick(30)
          send(a, [7])
          tick(30)
          return send(a, [8, '<end>'])
        }
      )
    })

    it('should end immediately if no value to emit later', function() {
      const a = send(prop(), [0])
      return expect(a.debounce(100)).toEmitInTime([[0, {current: 0}], [100, 1], [200, '<end>']], function(tick) {
        send(a, [1])
        tick(200)
        return send(a, ['<end>'])
      })
    })

    it('should handle events (immediate)', function() {
      const a = send(prop(), [0])
      return expect(a.debounce(100, {immediate: true})).toEmitInTime(
        [[0, {current: 0}], [0, 1], [260, 4], [460, 5], [610, '<end>']],
        function(tick) {
          send(a, [1])
          tick(30)
          send(a, [2])
          tick(30)
          send(a, [3])
          tick(200)
          send(a, [4])
          tick(200)
          send(a, [5])
          tick(90)
          send(a, [6])
          tick(30)
          send(a, [7])
          tick(30)
          return send(a, [8, '<end>'])
        }
      )
    })

    it('should end immediately if no value to emit later (immediate)', function() {
      const a = send(prop(), [0])
      return expect(a.debounce(100, {immediate: true})).toEmitInTime([[0, {current: 0}], [0, 1], [0, '<end>']], tick =>
        send(a, [1, '<end>'])
      )
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.debounce(100)).errorsToFlow(a)
    })
  })
})
