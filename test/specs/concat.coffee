{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'concat', ->

  it 'should return stream', ->
    expect(Kefir.concat([])).toBeStream()
    expect(Kefir.concat([stream(), prop()])).toBeStream()
    expect(stream().concat(stream())).toBeStream()
    expect(prop().concat(prop())).toBeStream()

  it 'should be ended if empty array provided', ->
    expect(Kefir.concat([])).toEmit ['<end:current>']

  it 'should be ended if array of ended observables provided', ->
    a = send(stream(), ['<end>'])
    b = send(prop(), ['<end>'])
    c = send(stream(), ['<end>'])
    expect(Kefir.concat([a, b, c])).toEmit ['<end:current>']
    expect(a.concat(b)).toEmit ['<end:current>']

  it 'should activate only current source', ->
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.concat([a, b, c])).toActivate(a)
    expect(Kefir.concat([a, b, c])).not.toActivate(b, c)
    expect(a.concat(b)).toActivate(a)
    expect(a.concat(b)).not.toActivate(b)
    send(a, ['<end>'])
    expect(Kefir.concat([a, b, c])).toActivate(b)
    expect(Kefir.concat([a, b, c])).not.toActivate(a, c)
    expect(a.concat(b)).toActivate(b)
    expect(a.concat(b)).not.toActivate(a)

  it 'should deliver events from observables, then end when all of them end', ->
    a = send(prop(), [0])
    b = prop()
    c = stream()
    expect(Kefir.concat([a, b, c])).toEmit [{current: 0}, 1, 4, 2, 5, 7, 8, '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4, '<end>'])
      send(b, [5])
      send(c, [6])
      send(b, ['<end>'])
      send(c, [7, 8, '<end>'])
    a = send(prop(), [0])
    b = stream()
    expect(a.concat(b)).toEmit [{current: 0}, 1, 3, 4, '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(a, ['<end>'])
      send(b, [3, 4, '<end>'])

  it 'should deliver current from current source, but only to first subscriber on each activation', ->
    a = send(prop(), [0])
    b = send(prop(), [1])
    c = stream()

    concat = Kefir.concat([a, b, c])
    expect(concat).toEmit [{current: 0}]

    concat = Kefir.concat([a, b, c])
    activate(concat)
    expect(concat).toEmit []

    concat = Kefir.concat([a, b, c])
    activate(concat)
    deactivate(concat)
    expect(concat).toEmit [{current: 0}]

  it 'if made of ended properties, should emit all currents then end', ->
    expect(
      Kefir.concat([
        send(prop(), [0, '<end>']),
        send(prop(), [1, '<end>']),
        send(prop(), [2, '<end>'])
      ])
    ).toEmit [{current: 0}, {current: 1}, {current: 2}, '<end:current>']




