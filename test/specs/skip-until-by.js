/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir, activate, deactivate} = require('../test-helpers.coffee')

describe('skipUntilBy', function() {
  describe('common', function() {
    it('errors should flow', function() {
      let a = stream()
      let b = stream()
      expect(a.skipUntilBy(b)).errorsToFlow(a)
      a = stream()
      b = stream()
      expect(a.skipUntilBy(b)).errorsToFlow(b)
      a = prop()
      b = stream()
      expect(a.skipUntilBy(b)).errorsToFlow(a)
      a = prop()
      b = stream()
      expect(a.skipUntilBy(b)).errorsToFlow(b)
      a = stream()
      b = prop()
      expect(a.skipUntilBy(b)).errorsToFlow(a)
      a = stream()
      b = prop()
      expect(a.skipUntilBy(b)).errorsToFlow(b)
      a = prop()
      b = prop()
      expect(a.skipUntilBy(b)).errorsToFlow(a)
      a = prop()
      b = prop()
      return expect(a.skipUntilBy(b)).errorsToFlow(b)
    })

    return it('errors should flow after first value from secondary', function() {
      const a = stream()
      const b = stream()
      const res = a.skipUntilBy(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      return expect(res).errorsToFlow(b)
    })
  })

  describe('stream, stream', function() {
    it('should return a stream', () => expect(stream().skipUntilBy(stream())).toBeStream())

    it('should activate/deactivate sources', function() {
      const a = stream()
      const b = stream()
      return expect(a.skipUntilBy(b)).toActivate(a, b)
    })

    it('should do activate secondary after first value from it', function() {
      const a = stream()
      const b = stream()
      const res = a.skipUntilBy(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      return expect(res).toActivate(b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(stream(), ['<end>']).skipUntilBy(stream())).toEmit(['<end:current>']))

    it('should be ended if secondary was ended', () =>
      expect(stream().skipUntilBy(send(stream(), ['<end>']))).toEmit(['<end:current>']))

    it('should not end when secondary ends if it produced at least one value', function() {
      const a = stream()
      const b = stream()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(b, [0, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', function() {
      const a = stream()
      const b = stream()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(a, [1, 2]))
    })

    return it('should emit all values from primary after first value from secondary', function() {
      const a = stream()
      const b = stream()
      return expect(a.skipUntilBy(b)).toEmit([3, 4, 5, 6, 7, 8, 9, '<end>'], function() {
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        return send(a, [9, '<end>'])
      })
    })
  })

  describe('stream, property', function() {
    it('should return a stream', () => expect(stream().skipUntilBy(prop())).toBeStream())

    it('should activate/deactivate sources', function() {
      const a = stream()
      const b = prop()
      return expect(a.skipUntilBy(b)).toActivate(a, b)
    })

    it('should do activate secondary after first value from it', function() {
      const a = stream()
      const b = prop()
      const res = a.skipUntilBy(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      return expect(res).toActivate(b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(stream(), ['<end>']).skipUntilBy(prop())).toEmit(['<end:current>']))

    it('should be ended if secondary was ended and has no current', () =>
      expect(stream().skipUntilBy(send(prop(), ['<end>']))).toEmit(['<end:current>']))

    it('should not be ended if secondary was ended but has any current', () =>
      expect(stream().skipUntilBy(send(prop(), [0, '<end>']))).toEmit([]))

    it('should not end when secondary ends if it produced at least one value', function() {
      const a = stream()
      const b = prop()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(b, [true, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', function() {
      const a = stream()
      const b = prop()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(a, [1, 2]))
    })

    return it('should filter values as expected', function() {
      const a = stream()
      const b = send(prop(), [0])
      return expect(a.skipUntilBy(b)).toEmit([3, 4, 5, 6, 7, 8, 9, '<end>'], function() {
        send(a, [3, 4])
        send(b, [2])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        return send(a, [9, '<end>'])
      })
    })
  })

  describe('property, stream', function() {
    it('should return a property', () => expect(prop().skipUntilBy(stream())).toBeProperty())

    it('should activate/deactivate sources', function() {
      const a = prop()
      const b = stream()
      return expect(a.skipUntilBy(b)).toActivate(a, b)
    })

    it('should do activate secondary after first value from it', function() {
      const a = prop()
      const b = stream()
      const res = a.skipUntilBy(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      return expect(res).toActivate(b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(prop(), ['<end>']).skipUntilBy(stream())).toEmit(['<end:current>']))

    it('should be ended if secondary was ended', () =>
      expect(prop().skipUntilBy(send(stream(), ['<end>']))).toEmit(['<end:current>']))

    it('should not end when secondary ends if it produced at least one value', function() {
      const a = prop()
      const b = stream()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(b, [0, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', function() {
      const a = prop()
      const b = stream()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(a, [1, 2]))
    })

    return it('should filter values as expected', function() {
      const a = send(prop(), [0])
      const b = stream()
      return expect(a.skipUntilBy(b)).toEmit([3, 4, 5, 6, 7, 8, 9, '<end>'], function() {
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        return send(a, [9, '<end>'])
      })
    })
  })

  return describe('property, property', function() {
    it('should return a property', () => expect(prop().skipUntilBy(prop())).toBeProperty())

    it('should activate/deactivate sources', function() {
      const a = prop()
      const b = prop()
      return expect(a.skipUntilBy(b)).toActivate(a, b)
    })

    it('should do activate secondary after first value from it', function() {
      const a = prop()
      const b = prop()
      const res = a.skipUntilBy(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      return expect(res).toActivate(b)
    })

    it('should be ended if primary was ended', () =>
      expect(send(prop(), ['<end>']).skipUntilBy(prop())).toEmit(['<end:current>']))

    it('should be ended if secondary was ended and has no current', () =>
      expect(prop().skipUntilBy(send(prop(), ['<end>']))).toEmit(['<end:current>']))

    it('should not be ended if secondary was ended but has any current', () =>
      expect(prop().skipUntilBy(send(prop(), [0, '<end>']))).toEmit([]))

    it('should not end when secondary ends if it produced at least one value', function() {
      const a = prop()
      const b = prop()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(b, [true, '<end>']))
    })

    it('should ignore values from primary until first value from secondary', function() {
      const a = prop()
      const b = prop()
      return expect(a.skipUntilBy(b)).toEmit([], () => send(a, [1, 2]))
    })

    return it('should filter values as expected', function() {
      const a = send(prop(), [0])
      const b = send(prop(), [0])
      return expect(a.skipUntilBy(b)).toEmit([{current: 0}, 3, 4, 5, 6, 7, 8, 9, '<end>'], function() {
        send(a, [3, 4])
        send(b, [2])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        return send(a, [9, '<end>'])
      })
    })
  })
})
