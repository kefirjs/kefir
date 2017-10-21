/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, shakyTimeTest, Kefir} = require('../test-helpers.coffee')

describe('delay', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().delay(100)).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.delay(100)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).delay(100)).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.delay(100)).toEmitInTime([[100, 1], [150, 2], [250, '<end>']], function(tick) {
        send(a, [1])
        tick(50)
        send(a, [2])
        tick(100)
        return send(a, ['<end>'])
      })
    })

    it('errors should flow', function() {
      const a = stream()
      return expect(a.delay(100)).errorsToFlow(a)
    })

    // see https://github.com/rpominov/kefir/issues/134
    return describe('works with undependable setTimeout', () =>
      shakyTimeTest(function(expectToEmitOverShakyTime) {
        const a = stream()
        return expectToEmitOverShakyTime(a.delay(10), [[10, 1], [15, 4], [15, '<end>']], function(tick) {
          send(a, [1])
          tick(5)
          send(a, [4])
          return send(a, ['<end>'])
        })
      }))
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().delay(100)).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.delay(100)).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).delay(100)).toEmit(['<end:current>']))

    it('should handle events and current', function() {
      const a = send(prop(), [1])
      return expect(a.delay(100)).toEmitInTime([[0, {current: 1}], [100, 2], [150, 3], [250, '<end>']], function(tick) {
        send(a, [2])
        tick(50)
        send(a, [3])
        tick(100)
        return send(a, ['<end>'])
      })
    })

    return it('errors should flow', function() {
      const a = prop()
      return expect(a.delay(100)).errorsToFlow(a)
    })
  })
})
