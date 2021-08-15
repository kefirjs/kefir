const {stream, prop, send, value, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('merge', () => {
  it('should return stream', () => {
    expect(Kefir.merge([])).to.be.observable.stream()
    expect(Kefir.merge([stream(), prop()])).to.be.observable.stream()
    expect(stream().merge(stream())).to.be.observable.stream()
    expect(prop().merge(prop())).to.be.observable.stream()
  })

  it('should be ended if empty array provided', () => {
    expect(Kefir.merge([])).to.emit([end({current: true})])
  })

  it('should be ended if array of ended observables provided', () => {
    const a = send(stream(), [end()])
    const b = send(prop(), [end()])
    const c = send(stream(), [end()])
    expect(Kefir.merge([a, b, c])).to.emit([end({current: true})])
    expect(a.merge(b)).to.emit([end({current: true})])
  })

  it('should activate sources', () => {
    const a = stream()
    const b = prop()
    const c = stream()
    expect(Kefir.merge([a, b, c])).to.activate(a, b, c)
    expect(a.merge(b)).to.activate(a, b)
  })

  it('should deliver events from observables, then end when all of them end', () => {
    let a = stream()
    let b = send(prop(), [value(0)])
    const c = stream()
    expect(Kefir.merge([a, b, c])).to.emit(
      [value(0, {current: true}), value(1), value(2), value(3), value(4), value(5), value(6), end()],
      () => {
        send(a, [value(1)])
        send(b, [value(2)])
        send(c, [value(3)])
        send(a, [end()])
        send(b, [value(4), end()])
        send(c, [value(5), value(6), end()])
      }
    )
    a = stream()
    b = send(prop(), [value(0)])
    expect(a.merge(b)).to.emit([value(0, {current: true}), value(1), value(2), value(3), end()], () => {
      send(a, [value(1)])
      send(b, [value(2)])
      send(a, [end()])
      send(b, [value(3), end()])
    })
  })

  it('should deliver currents from all source properties, but only to first subscriber on each activation', () => {
    const a = send(prop(), [value(0)])
    const b = send(prop(), [value(1)])
    const c = send(prop(), [value(2)])

    const mergeA = Kefir.merge([a, b, c])
    expect(mergeA).to.emit([value(0, {current: true}), value(1, {current: true}), value(2, {current: true})])

    const mergeB = Kefir.merge([a, b, c])
    activate(mergeB)
    expect(mergeB).to.emit([])

    const mergeC = Kefir.merge([a, b, c])
    activate(mergeC)
    deactivate(mergeC)
    expect(mergeC).to.emit([value(0, {current: true}), value(1, {current: true}), value(2, {current: true})])

    deactivate(mergeB)
  })

  it('errors should flow', () => {
    let a = stream()
    let b = prop()
    let c = stream()
    expect(Kefir.merge([a, b, c])).to.flowErrors(a)
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.merge([a, b, c])).to.flowErrors(b)
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.merge([a, b, c])).to.flowErrors(c)
  })

  it('should work correctly when unsuscribing after one sync event', () => {
    const a = Kefir.constant(1)
    const b = Kefir.interval(1000, 1)
    const c = a.merge(b)
    activate(c.take(1))
    expect(b).not.to.be.active()
  })
})
