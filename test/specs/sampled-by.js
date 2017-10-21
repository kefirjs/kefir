/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe('sampledBy', function() {
  it('should return stream', function() {
    expect(prop().sampledBy(stream())).toBeStream()
    return expect(stream().sampledBy(prop())).toBeStream()
  })

  it('should be ended if array of ended observables provided', function() {
    const a = send(stream(), ['<end>'])
    return expect(prop().sampledBy(a)).toEmit(['<end:current>'])
  })

  it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', function() {
    const a = send(prop(), [1, '<end>'])
    const b = send(prop(), [2, '<end>'])
    const s2 = a.sampledBy(b)
    expect(s2).toEmit([{current: 1}, '<end:current>'])
    return expect(s2).toEmit(['<end:current>'])
  })

  it('should activate sources', function() {
    const a = stream()
    const b = prop()
    return expect(a.sampledBy(b)).toActivate(a, b)
  })

  it('should handle events and current from observables', function() {
    const a = stream()
    const b = send(prop(), [0])
    return expect(a.sampledBy(b)).toEmit([2, 4, 4, '<end>'], function() {
      send(b, [1])
      send(a, [2])
      send(b, [3])
      send(a, [4])
      return send(b, [5, 6, '<end>'])
    })
  })

  it('should accept optional combinator function', function() {
    const join = (...args) => args.join('+')
    const a = stream()
    const b = send(prop(), [0])
    return expect(a.sampledBy(b, join)).toEmit(['2+3', '4+5', '4+6', '<end>'], function() {
      send(b, [1])
      send(a, [2])
      send(b, [3])
      send(a, [4])
      return send(b, [5, 6, '<end>'])
    })
  })

  it('one sampledBy should remove listeners of another', function() {
    const a = send(prop(), [0])
    const b = stream()
    const s1 = a.sampledBy(b)
    const s2 = a.sampledBy(b)
    activate(s1)
    activate(s2)
    deactivate(s2)
    return expect(s1).toEmit([0], () => send(b, [1]))
  })

  // https://github.com/rpominov/kefir/issues/98
  return it('should work nice for emitating atomic updates', function() {
    const a = stream()
    const b = a.map(x => x + 2)
    const c = a.map(x => x * 2)
    return expect(b.sampledBy(c, (x, y) => [x, y])).toEmit([[3, 2], [4, 4], [5, 6]], () => send(a, [1, 2, 3]))
  })
})
