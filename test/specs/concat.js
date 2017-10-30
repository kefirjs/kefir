const {stream, prop, send, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('concat', () => {
  it('should stream', () => {
    expect(Kefir.concat([])).to.be.observable.stream()
    expect(Kefir.concat([stream(), prop()])).to.be.observable.stream()
    expect(stream().concat(stream())).to.be.observable.stream()
    expect(prop().concat(prop())).to.be.observable.stream()
  })

  it('should be ended if empty array provided', () => {
    expect(Kefir.concat([])).to.emit(['<end:current>'])
  })

  it('should be ended if array of ended observables provided', () => {
    const a = send(stream(), ['<end>'])
    const b = send(prop(), ['<end>'])
    const c = send(stream(), ['<end>'])
    expect(Kefir.concat([a, b, c])).to.emit(['<end:current>'])
    expect(a.concat(b)).to.emit(['<end:current>'])
  })

  it('should activate only current source', () => {
    const a = stream()
    const b = prop()
    const c = stream()
    expect(Kefir.concat([a, b, c])).to.activate(a)
    expect(Kefir.concat([a, b, c])).not.to.activate(b, c)
    expect(a.concat(b)).to.activate(a)
    expect(a.concat(b)).not.to.activate(b)
    send(a, ['<end>'])
    expect(Kefir.concat([a, b, c])).to.activate(b)
    expect(Kefir.concat([a, b, c])).not.to.activate(a, c)
    expect(a.concat(b)).to.activate(b)
    expect(a.concat(b)).not.to.activate(a)
  })

  it('should deliver events from observables, then end when all of them end', () => {
    let a = send(prop(), [0])
    let b = prop()
    const c = stream()
    expect(Kefir.concat([a, b, c])).to.emit([{current: 0}, 1, 4, 2, 5, 7, 8, '<end>'], () => {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4, '<end>'])
      send(b, [5])
      send(c, [6])
      send(b, ['<end>'])
      send(c, [7, 8, '<end>'])
    })
    a = send(prop(), [0])
    b = stream()
    expect(a.concat(b)).to.emit([{current: 0}, 1, 3, 4, '<end>'], () => {
      send(a, [1])
      send(b, [2])
      send(a, ['<end>'])
      send(b, [3, 4, '<end>'])
    })
  })

  it('should deliver current from current source, but only to first subscriber on each activation', () => {
    const a = send(prop(), [0])
    const b = send(prop(), [1])
    const c = stream()

    let concat = Kefir.concat([a, b, c])
    expect(concat).to.emit([{current: 0}])

    concat = Kefir.concat([a, b, c])
    activate(concat)
    expect(concat).to.emit([])

    concat = Kefir.concat([a, b, c])
    activate(concat)
    deactivate(concat)
    expect(concat).to.emit([{current: 0}])
  })

  it('if made of ended properties, should emit all currents then end', () => {
    expect(Kefir.concat([send(prop(), [0, '<end>']), send(prop(), [1, '<end>']), send(prop(), [2, '<end>'])])).to.emit([
      {current: 0},
      {current: 1},
      {current: 2},
      '<end:current>',
    ])
  })

  it('errors should flow', () => {
    let a = stream()
    let b = prop()
    let c = stream()
    expect(Kefir.concat([a, b, c])).to.flowErrors(a)
    a = send(stream(), ['<end>'])
    b = prop()
    c = stream()
    expect(Kefir.concat([a, b, c])).to.flowErrors(b)
    a = send(stream(), ['<end>'])
    b = prop()
    c = stream()
    const result = Kefir.concat([a, b, c])
    activate(result)
    send(b, ['<end>'])
    deactivate(result)
    expect(result).to.flowErrors(c)
  })
})
