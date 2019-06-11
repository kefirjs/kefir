const {stream, prop, send, value, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('pool', () => {
  it('should return stream', () => {
    expect(Kefir.pool()).to.be.observable.stream()
    expect(new Kefir.Pool()).to.be.observable.stream()
  })

  it('should return pool', () => {
    expect(Kefir.pool()).to.be.pool()
    expect(new Kefir.Pool()).to.be.pool()
  })

  it('should activate sources', () => {
    const a = stream()
    const b = prop()
    const c = stream()
    const pool = Kefir.pool()
      .plug(a)
      .plug(b)
      .plug(c)
    expect(pool).to.activate(a, b, c)
    pool.unplug(b)
    expect(pool).to.activate(a, c)
    expect(pool).not.to.activate(b)
  })

  it('should deliver events from observables', () => {
    const a = stream()
    const b = send(prop(), [value(0)])
    const c = stream()
    const pool = Kefir.pool()
      .plug(a)
      .plug(b)
      .plug(c)
    expect(pool).to.emit(
      [value(0, {current: true}), value(1), value(2), value(3), value(4), value(5), value(6)],
      () => {
        send(a, [value(1)])
        send(b, [value(2)])
        send(c, [value(3)])
        send(a, [end()])
        send(b, [value(4), end()])
        send(c, [value(5), value(6), end()])
      }
    )
  })

  it('should deliver currents from all source properties, but only to first subscriber on each activation', () => {
    const a = send(prop(), [value(0)])
    const b = send(prop(), [value(1)])
    const c = send(prop(), [value(2)])

    let pool = Kefir.pool()
      .plug(a)
      .plug(b)
      .plug(c)
    expect(pool).to.emit([value(0, {current: true}), value(1, {current: true}), value(2, {current: true})])

    pool = Kefir.pool()
      .plug(a)
      .plug(b)
      .plug(c)
    activate(pool)
    expect(pool).to.emit([])

    pool = Kefir.pool()
      .plug(a)
      .plug(b)
      .plug(c)
    activate(pool)
    deactivate(pool)
    expect(pool).to.emit([value(0, {current: true}), value(1, {current: true}), value(2, {current: true})])
  })

  it('should not deliver events from removed sources', () => {
    const a = stream()
    const b = send(prop(), [value(0)])
    const c = stream()
    const pool = Kefir.pool()
      .plug(a)
      .plug(b)
      .plug(c)
      .unplug(b)
    expect(pool).to.emit([value(1), value(3), value(5), value(6)], () => {
      send(a, [value(1)])
      send(b, [value(2)])
      send(c, [value(3)])
      send(a, [end()])
      send(b, [value(4), end()])
      send(c, [value(5), value(6), end()])
    })
  })

  it('should correctly handle current values of new sub sources', () => {
    const pool = Kefir.pool()
    const b = send(prop(), [value(1)])
    const c = send(prop(), [value(2)])
    expect(pool).to.emit([value(1), value(2)], () => {
      pool.plug(b)
      pool.plug(c)
    })
  })

  it('errors should flow', () => {
    const a = stream()
    const b = prop()
    const c = stream()
    const pool = Kefir.pool()
    pool.plug(a)
    expect(pool).to.flowErrors(a)
    pool.unplug(a)
    expect(pool).not.to.flowErrors(a)
    pool.plug(a)
    pool.plug(b)
    expect(pool).to.flowErrors(a)
    expect(pool).to.flowErrors(b)
    pool.unplug(b)
    expect(pool).not.to.flowErrors(b)
    pool.plug(c)
    expect(pool).to.flowErrors(c)
  })
})
