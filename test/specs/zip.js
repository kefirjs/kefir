/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe('zip', function() {
  it('should return stream', function() {
    expect(Kefir.zip([])).toBeStream()
    expect(Kefir.zip([stream(), prop()])).toBeStream()
    expect(stream().zip(stream())).toBeStream()
    return expect(prop().zip(prop())).toBeStream()
  })

  it('should be ended if empty array provided', () => expect(Kefir.zip([])).toEmit(['<end:current>']))

  it('should be ended if array of ended observables provided', function() {
    const a = send(stream(), ['<end>'])
    const b = send(prop(), ['<end>'])
    const c = send(stream(), ['<end>'])
    expect(Kefir.zip([a, b, c])).toEmit(['<end:current>'])
    return expect(a.zip(b)).toEmit(['<end:current>'])
  })

  it('should be ended and has current if array of ended properties provided and each of them has current', function() {
    const a = send(prop(), [1, '<end>'])
    const b = send(prop(), [2, '<end>'])
    const c = send(prop(), [3, '<end>'])
    expect(Kefir.zip([a, b, c])).toEmit([{current: [1, 2, 3]}, '<end:current>'])
    return expect(a.zip(b)).toEmit([{current: [1, 2]}, '<end:current>'])
  })

  it('should activate sources', function() {
    const a = stream()
    const b = prop()
    const c = stream()
    expect(Kefir.zip([a, b, c])).toActivate(a, b, c)
    return expect(a.zip(b)).toActivate(a, b)
  })

  it('should handle events and current from observables', function() {
    let a = stream()
    let b = send(prop(), [0])
    const c = stream()
    // a   --1---4-------6-7--------X
    // b  0---2------------------9X
    // c   ----3-------5-------8------X
    //     ----•-------•---------•----X
    //   [1,0,3] [4,2,5]   [6,9,8]
    expect(Kefir.zip([a, b, c])).toEmit([[1, 0, 3], [4, 2, 5], [6, 9, 8], '<end>'], function() {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4])
      send(c, [5])
      send(a, [6, 7])
      send(c, [8])
      send(b, [9, '<end>'])
      send(a, ['<end>'])
      return send(c, ['<end>'])
    })

    a = stream()
    b = send(prop(), [0])
    return expect(a.zip(b)).toEmit([[1, 0], [3, 2], '<end>'], function() {
      send(b, [2])
      send(a, [1, 3, '<end>'])
      return send(b, ['<end>'])
    })
  })

  it('should support arrays', function() {
    let a = [1, 4, 6, 7]
    let b = send(prop(), [0])
    const c = stream()
    // a   1, 4, 6, 7
    // b  0---2------------------9X
    // c   ----3-------5-------8------X
    //     ----•-------•---------•----X
    //   [1,0,3] [4,2,5]   [6,9,8]
    expect(Kefir.zip([a, b, c])).toEmit([[1, 0, 3], [4, 2, 5], [6, 9, 8], '<end>'], function() {
      send(b, [2])
      send(c, [3])
      send(c, [5])
      send(c, [8])
      send(b, [9, '<end>'])
      return send(c, ['<end>'])
    })

    a = [1, 3]
    b = send(prop(), [0])
    return expect(b.zip(a)).toEmit([{current: [0, 1]}, [2, 3], '<end>'], function() {
      send(b, [2])
      return send(b, ['<end>'])
    })
  })

  it('should work with arrays only', () =>
    expect(Kefir.zip([[1, 2, 3], [4, 5], [6, 7, 8, 9]])).toEmit([
      {current: [1, 4, 6]},
      {current: [2, 5, 7]},
      '<end:current>',
    ]))

  it('should accept optional combinator function', function() {
    const join = (...args) => args.join('+')
    let a = stream()
    let b = send(prop(), [0])
    const c = stream()
    expect(Kefir.zip([a, b, c], join)).toEmit(['1+0+3', '4+2+5', '6+9+8', '<end>'], function() {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4])
      send(c, [5])
      send(a, [6, 7])
      send(c, [8])
      send(b, [9, '<end>'])
      send(a, ['<end>'])
      return send(c, ['<end>'])
    })

    a = stream()
    b = send(prop(), [0])
    return expect(a.zip(b, join)).toEmit(['1+0', '3+2', '<end>'], function() {
      send(b, [2])
      send(a, [1, 3, '<end>'])
      return send(b, ['<end>'])
    })
  })

  it('errors should flow', function() {
    let a = stream()
    let b = prop()
    let c = stream()
    expect(Kefir.zip([a, b, c])).errorsToFlow(a)
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.zip([a, b, c])).errorsToFlow(b)
    a = stream()
    b = prop()
    c = stream()
    return expect(Kefir.zip([a, b, c])).errorsToFlow(c)
  })

  it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
    const a = send(prop(), [0])
    const b = send(prop(), [1])
    const cb = Kefir.zip([a, b])
    activate(cb)
    deactivate(cb)
    return expect(cb).toEmit([{current: [0, 1]}])
  })

  return it('should work correctly when unsuscribing after one sync event', function() {
    let c1
    const a0 = stream()
    const a = a0.toProperty(() => 1)
    const b0 = stream()
    const b = b0.toProperty(() => 1)
    const c = Kefir.zip([a, b])

    activate((c1 = c.take(2)))
    send(b0, [1, 1])
    send(a0, [1])
    deactivate(c1)

    activate(c.take(1))
    return expect(b).not.toBeActive()
  })
})
