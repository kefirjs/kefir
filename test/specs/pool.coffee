{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'pool', ->

  it 'should return stream', ->
    expect(Kefir.pool()).toBeStream()

  it 'should activate sources', ->
    a = stream()
    b = prop()
    c = stream()
    pool = Kefir.pool().plug(a).plug(b).plug(c)
    expect(pool).toActivate(a, b, c)
    pool.unplug(b)
    expect(pool).toActivate(a, c)
    expect(pool).not.toActivate(b)

  it 'should deliver events from observables', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    pool = Kefir.pool().plug(a).plug(b).plug(c)
    expect(pool).toEmit [{current: 0}, 1, 2, 3, 4, 5, 6], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])

  it 'should deliver currents from all source properties, but only to first subscriber on each activation', ->
    a = send(prop(), [0])
    b = send(prop(), [1])
    c = send(prop(), [2])

    pool = Kefir.pool().plug(a).plug(b).plug(c)
    expect(pool).toEmit [{current: 0}, {current: 1}, {current: 2}]

    pool = Kefir.pool().plug(a).plug(b).plug(c)
    activate(pool)
    expect(pool).toEmit []

    pool = Kefir.pool().plug(a).plug(b).plug(c)
    activate(pool)
    deactivate(pool)
    expect(pool).toEmit [{current: 0}, {current: 1}, {current: 2}]

  it 'should not deliver events from removed sources', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    pool = Kefir.pool().plug(a).plug(b).plug(c).unplug(b)
    expect(pool).toEmit [1, 3, 5, 6], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])

  it 'should correctly handle current values of new sub sources', ->
      pool = Kefir.pool()
      b = send(prop(), [1])
      c = send(prop(), [2])
      expect(pool).toEmit [1, 2], ->
        pool.plug(b)
        pool.plug(c)


  it 'errors should flow', ->
    a = stream()
    b = prop()
    c = stream()
    pool = Kefir.pool()
    pool.plug(a)
    expect(pool).errorsToFlow(a)
    pool.unplug(a)
    expect(pool).not.errorsToFlow(a)
    pool.plug(a)
    pool.plug(b)
    expect(pool).errorsToFlow(a)
    expect(pool).errorsToFlow(b)
    pool.unplug(b)
    expect(pool).not.errorsToFlow(b)
    pool.plug(c)
    expect(pool).errorsToFlow(c)







