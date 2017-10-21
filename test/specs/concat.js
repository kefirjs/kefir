/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe('concat', function() {
  it('should return stream', function() {
    expect(Kefir.concat([])).toBeStream()
    expect(Kefir.concat([stream(), prop()])).toBeStream()
    expect(stream().concat(stream())).toBeStream()
    return expect(prop().concat(prop())).toBeStream()
  })

  it('should be ended if empty array provided', () => expect(Kefir.concat([])).toEmit(['<end:current>']))

  it('should be ended if array of ended observables provided', function() {
    const a = send(stream(), ['<end>'])
    const b = send(prop(), ['<end>'])
    const c = send(stream(), ['<end>'])
    expect(Kefir.concat([a, b, c])).toEmit(['<end:current>'])
    return expect(a.concat(b)).toEmit(['<end:current>'])
  })

  it('should activate only current source', function() {
    const a = stream()
    const b = prop()
    const c = stream()
    expect(Kefir.concat([a, b, c])).toActivate(a)
    expect(Kefir.concat([a, b, c])).not.toActivate(b, c)
    expect(a.concat(b)).toActivate(a)
    expect(a.concat(b)).not.toActivate(b)
    send(a, ['<end>'])
    expect(Kefir.concat([a, b, c])).toActivate(b)
    expect(Kefir.concat([a, b, c])).not.toActivate(a, c)
    expect(a.concat(b)).toActivate(b)
    return expect(a.concat(b)).not.toActivate(a)
  })

  it('should deliver events from observables, then end when all of them end', function() {
    let a = send(prop(), [0])
    let b = prop()
    const c = stream()
    expect(Kefir.concat([a, b, c])).toEmit([{current: 0}, 1, 4, 2, 5, 7, 8, '<end>'], function() {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4, '<end>'])
      send(b, [5])
      send(c, [6])
      send(b, ['<end>'])
      return send(c, [7, 8, '<end>'])
    })
    a = send(prop(), [0])
    b = stream()
    return expect(a.concat(b)).toEmit([{current: 0}, 1, 3, 4, '<end>'], function() {
      send(a, [1])
      send(b, [2])
      send(a, ['<end>'])
      return send(b, [3, 4, '<end>'])
    })
  })

  it('should deliver current from current source, but only to first subscriber on each activation', function() {
    const a = send(prop(), [0])
    const b = send(prop(), [1])
    const c = stream()

    let concat = Kefir.concat([a, b, c])
    expect(concat).toEmit([{current: 0}])

    concat = Kefir.concat([a, b, c])
    activate(concat)
    expect(concat).toEmit([])

    concat = Kefir.concat([a, b, c])
    activate(concat)
    deactivate(concat)
    return expect(concat).toEmit([{current: 0}])
  })

  it('if made of ended properties, should emit all currents then end', () =>
    expect(Kefir.concat([send(prop(), [0, '<end>']), send(prop(), [1, '<end>']), send(prop(), [2, '<end>'])])).toEmit([
      {current: 0},
      {current: 1},
      {current: 2},
      '<end:current>',
    ]))

  return it('errors should flow', function() {
    let a = stream()
    let b = prop()
    let c = stream()
    expect(Kefir.concat([a, b, c])).errorsToFlow(a)
    a = send(stream(), ['<end>'])
    b = prop()
    c = stream()
    expect(Kefir.concat([a, b, c])).errorsToFlow(b)
    a = send(stream(), ['<end>'])
    b = prop()
    c = stream()
    const result = Kefir.concat([a, b, c])
    activate(result)
    send(b, ['<end>'])
    deactivate(result)
    return expect(result).errorsToFlow(c)
  })
})
