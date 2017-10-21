/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir, activate, deactivate} = require('../test-helpers.coffee')

describe('toProperty', function() {
  describe('stream', function() {
    it('should return property', function() {
      expect(stream().toProperty(() => 0)).toBeProperty()
      return expect(stream().toProperty()).toBeProperty()
    })

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.toProperty()).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).toProperty()).toEmit(['<end:current>']))

    it('should be ended if source was ended (with current)', () =>
      expect(send(stream(), ['<end>']).toProperty(() => 0)).toEmit([{current: 0}, '<end:current>']))

    it('should handle events', function() {
      const a = stream()
      const p = a.toProperty(() => 0)
      expect(p).toEmit([{current: 0}, 1, {error: 3}, 2, '<end>'], () => send(a, [1, {error: 3}, 2, '<end>']))
      return expect(p).toEmit([{current: 2}, '<end:current>'])
    })

    it('should call callback on each activation', function() {
      let count = 0
      const a = stream()
      const p = a.toProperty(() => count++)
      activate(p)
      expect(count).toBe(1)
      deactivate(p)
      expect(count).toBe(1)
      activate(p)
      return expect(count).toBe(2)
    })

    it('should reset value by getting new from the callback on each activation', function() {
      const getCurrent = function(p) {
        let result = null
        const getter = x => result = x
        p.onValue(getter)
        p.offValue(getter)
        return result
      }

      const a = stream()
      const p = a.toProperty(() => 0)

      expect(getCurrent(p)).toBe(0)
      activate(p)
      send(a, [1])
      expect(getCurrent(p)).toBe(1)
      deactivate(p)
      return expect(getCurrent(p)).toBe(0)
    })

    return it('should throw when called with not a function', function() {
      let err = null
      try {
        stream().toProperty(1)
      } catch (e) {
        err = e
      }
      return expect(err.message).toBe('You should call toProperty() with a function or no arguments.')
    })
  })

  return describe('property', function() {
    it('should return property', function() {
      expect(prop().toProperty(() => 0)).toBeProperty()
      return expect(prop().toProperty()).toBeProperty()
    })

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.toProperty(() => 0)).toActivate(a)
    })

    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).toProperty(() => 0)).toEmit([{current: 0}, '<end:current>'])
      return expect(send(prop(), [1, '<end>']).toProperty(() => 0)).toEmit([{current: 1}, '<end:current>'])
    })

    it('should handle events', function() {
      let a = send(prop(), [1])
      let b = a.toProperty(() => 0)
      expect(b).toEmit([{current: 1}, 2, {error: 3}, '<end>'], () => send(a, [2, {error: 3}, '<end>']))
      expect(b).toEmit([{currentError: 3}, '<end:current>'])

      a = prop()
      b = a.toProperty(() => 0)
      expect(b).toEmit([{current: 0}, 2, {error: 3}, 4, '<end>'], () => send(a, [2, {error: 3}, 4, '<end>']))
      return expect(b).toEmit([{current: 4}, '<end:current>'])
    })

    return it('if original property has no current, and .toProperty called with no arguments, then result should have no current', () =>
      expect(prop().toProperty()).toEmit([]))
  })
})
