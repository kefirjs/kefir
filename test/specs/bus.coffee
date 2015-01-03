{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')

describe 'bus', ->


  # emitter specs

  it 'should return stream', ->
    expect(Kefir.bus()).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.bus()).toEmit []

  it 'should emit values and end', ->
    a = Kefir.bus()
    expect(a).toEmit [1, 2, {error: -1}, 3, '<end>'], ->
      a.emit(1)
      a.emit(2)
      a.error(-1)
      a.emit(3)
      a.end()



  # pool specs

  it 'should return stream', ->
    expect(Kefir.bus()).toBeStream()

  it 'should activate sources', ->
    a = stream()
    b = prop()
    c = stream()
    bus = Kefir.bus().plug(a).plug(b).plug(c)
    expect(bus).toActivate(a, b, c)
    bus.unplug(b)
    expect(bus).toActivate(a, c)
    expect(bus).not.toActivate(b)

  it 'should deliver events from observables', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    bus = Kefir.bus().plug(a).plug(b).plug(c)
    expect(bus).toEmit [{current: 0}, 1, 2, 3, 4, 5, 6], ->
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

    bus = Kefir.bus().plug(a).plug(b).plug(c)
    expect(bus).toEmit [{current: 0}, {current: 1}, {current: 2}]

    bus = Kefir.bus().plug(a).plug(b).plug(c)
    activate(bus)
    expect(bus).toEmit []

    bus = Kefir.bus().plug(a).plug(b).plug(c)
    activate(bus)
    deactivate(bus)
    expect(bus).toEmit [{current: 0}, {current: 1}, {current: 2}]

  it 'should not deliver events from removed sources', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    bus = Kefir.bus().plug(a).plug(b).plug(c).unplug(b)
    expect(bus).toEmit [1, 3, 5, 6], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])

  it 'should correctly handle current values of new sub sources', ->
      bus = Kefir.bus()
      b = send(prop(), [1])
      c = send(prop(), [2])
      expect(bus).toEmit [1, 2], ->
        bus.plug(b)
        bus.plug(c)

  it 'errors should flow', ->
    a = stream()
    b = prop()
    c = stream()
    pool = Kefir.bus()
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


  # bus specific specs

  it 'should deactivate sources on end', ->
    a = stream()
    b = prop()
    c = stream()
    bus = Kefir.bus().plug(a).plug(b).plug(c)
    bus.onEnd ->
    for obs in [a, b, c]
      expect(obs).toBeActive()
    bus.end()
    for obs in [a, b, c]
      expect(obs).not.toBeActive()
