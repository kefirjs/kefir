{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'merge', ->

  it 'should return stream', ->
    expect(Kefir.merge([])).toBeStream()
    expect(Kefir.merge([stream(), prop()])).toBeStream()
    expect(stream().merge(stream())).toBeStream()
    expect(prop().merge(prop())).toBeStream()

  it 'should be ended if empty array provided', ->
    expect(Kefir.merge([])).toEmit ['<end:current>']

  it 'should be ended if array of ended observables provided', ->
    a = send(stream(), ['<end>'])
    b = send(prop(), ['<end>'])
    c = send(stream(), ['<end>'])
    expect(Kefir.merge([a, b, c])).toEmit ['<end:current>']
    expect(a.merge(b)).toEmit ['<end:current>']

  it 'should activate sources', ->
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.merge([a, b, c])).toActivate(a, b, c)
    expect(a.merge(b)).toActivate(a, b)

  it 'should deliver events from observables, then end when all of them end', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    expect(Kefir.merge([a, b, c])).toEmit [{current: 0}, 1, 2, 3, 4, 5, 6, '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])
    a = stream()
    b = send(prop(), [0])
    expect(a.merge(b)).toEmit [{current: 0}, 1, 2, 3, '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(a, ['<end>'])
      send(b, [3, '<end>'])

  it 'should deliver currents from all source properties, but only to first subscriber on each activation', ->
    a = send(prop(), [0])
    b = send(prop(), [1])
    c = send(prop(), [2])

    merge = Kefir.merge([a, b, c])
    expect(merge).toEmit [{current: 0}, {current: 1}, {current: 2}]

    merge = Kefir.merge([a, b, c])
    activate(merge)
    expect(merge).toEmit []

    merge = Kefir.merge([a, b, c])
    activate(merge)
    deactivate(merge)
    expect(merge).toEmit [{current: 0}, {current: 1}, {current: 2}]

  it 'also allows to not wrap sources to array, but pass it as arguments', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    expect(Kefir.merge(a, b, c)).toEmit [{current: 0}, 1, 2, 3, 4, 5, 6, '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])


