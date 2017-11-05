const {stream, prop, send, value, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('concat', () => {
  it('should stream', () => {
    expect(Kefir.concat([])).to.be.observable.stream()
    expect(Kefir.concat([stream(), prop()])).to.be.observable.stream()
    expect(stream().concat(stream())).to.be.observable.stream()
    expect(prop().concat(prop())).to.be.observable.stream()
  })

  it('should be ended if empty array provided', () => {
    expect(Kefir.concat([])).to.emit([end({current: true})])
  })

  it('should be ended if array of ended observables provided', () => {
    const a = send(stream(), [end()])
    const b = send(prop(), [end()])
    const c = send(stream(), [end()])
    expect(Kefir.concat([a, b, c])).to.emit([end({current: true})])
    expect(a.concat(b)).to.emit([end({current: true})])
  })

  it('should activate only current source', () => {
    const a = stream()
    const b = prop()
    const c = stream()
    expect(Kefir.concat([a, b, c])).to.activate(a)
    expect(Kefir.concat([a, b, c])).not.to.activate(b, c)
    expect(a.concat(b)).to.activate(a)
    expect(a.concat(b)).not.to.activate(b)
    send(a, [end()])
    expect(Kefir.concat([a, b, c])).to.activate(b)
    expect(Kefir.concat([a, b, c])).not.to.activate(a, c)
    expect(a.concat(b)).to.activate(b)
    expect(a.concat(b)).not.to.activate(a)
  })

  it('should deliver events from observables, then end when all of them end', () => {
    let a = send(prop(), [value(0)])
    let b = prop()
    const c = stream()
    expect(Kefir.concat([a, b, c])).to.emit(
      [value(0, {current: true}), value(1), value(4), value(2), value(5), value(7), value(8), end()],
      () => {
        send(a, [value(1)])
        send(b, [value(2)])
        send(c, [value(3)])
        send(a, [value(4), end()])
        send(b, [value(5)])
        send(c, [value(6)])
        send(b, [end()])
        send(c, [value(7), value(8), end()])
      }
    )
    a = send(prop(), [value(0)])
    b = stream()
    expect(a.concat(b)).to.emit([value(0, {current: true}), value(1), value(3), value(4), end()], () => {
      send(a, [value(1)])
      send(b, [value(2)])
      send(a, [end()])
      send(b, [value(3), value(4), end()])
    })
  })

  it('should deliver current from current source, but only to first subscriber on each activation', () => {
    const a = send(prop(), [value(0)])
    const b = send(prop(), [value(1)])
    const c = stream()

    let concat = Kefir.concat([a, b, c])
    expect(concat).to.emit([value(0, {current: true})])

    concat = Kefir.concat([a, b, c])
    activate(concat)
    expect(concat).to.emit([])

    concat = Kefir.concat([a, b, c])
    activate(concat)
    deactivate(concat)
    expect(concat).to.emit([value(0, {current: true})])
  })

  it('if made of ended properties, should emit all currents then end', () => {
    expect(
      Kefir.concat([send(prop(), [value(0), end()]), send(prop(), [value(1), end()]), send(prop(), [value(2), end()])])
    ).to.emit([value(0, {current: true}), value(1, {current: true}), value(2, {current: true}), end({current: true})])
  })

  it('errors should flow', () => {
    let a = stream()
    let b = prop()
    let c = stream()
    expect(Kefir.concat([a, b, c])).to.flowErrors(a)
    a = send(stream(), [end()])
    b = prop()
    c = stream()
    expect(Kefir.concat([a, b, c])).to.flowErrors(b)
    a = send(stream(), [end()])
    b = prop()
    c = stream()
    const result = Kefir.concat([a, b, c])
    activate(result)
    send(b, [end()])
    deactivate(result)
    expect(result).to.flowErrors(c)
  })
})
