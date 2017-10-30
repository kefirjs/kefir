const {stream, prop, send, activate, deactivate, Kefir, expect} = require('../test-helpers')

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
    const pool = Kefir.pool().plug(a).plug(b).plug(c)
    expect(pool).to.activate(a, b, c)
    pool.unplug(b)
    expect(pool).to.activate(a, c)
    expect(pool).not.to.activate(b)
  })

  it('should deliver events from observables', () => {
    const a = stream()
    const b = send(prop(), [0])
    const c = stream()
    const pool = Kefir.pool().plug(a).plug(b).plug(c)
    expect(pool).to.emit([{current: 0}, 1, 2, 3, 4, 5, 6], () => {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])
    })
  })

  it('should deliver currents from all source properties, but only to first subscriber on each activation', () => {
    const a = send(prop(), [0])
    const b = send(prop(), [1])
    const c = send(prop(), [2])

    let pool = Kefir.pool().plug(a).plug(b).plug(c)
    expect(pool).to.emit([{current: 0}, {current: 1}, {current: 2}])

    pool = Kefir.pool().plug(a).plug(b).plug(c)
    activate(pool)
    expect(pool).to.emit([])

    pool = Kefir.pool().plug(a).plug(b).plug(c)
    activate(pool)
    deactivate(pool)
    expect(pool).to.emit([{current: 0}, {current: 1}, {current: 2}])
  })

  it('should not deliver events from removed sources', () => {
    const a = stream()
    const b = send(prop(), [0])
    const c = stream()
    const pool = Kefir.pool().plug(a).plug(b).plug(c).unplug(b)
    expect(pool).to.emit([1, 3, 5, 6], () => {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])
    })
  })

  it('should correctly handle current values of new sub sources', () => {
    const pool = Kefir.pool()
    const b = send(prop(), [1])
    const c = send(prop(), [2])
    expect(pool).to.emit([1, 2], () => {
      pool.plug(b)
      return pool.plug(c)
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
