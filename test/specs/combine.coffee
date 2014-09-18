{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'combine', ->

  it 'should return stream', ->
    expect(Kefir.combine([])).toBeStream()
    expect(Kefir.combine([stream(), prop()])).toBeStream()
    expect(stream().combine(stream())).toBeStream()
    expect(prop().combine(prop())).toBeStream()

  it 'should be ended if empty array provided', ->
    expect(Kefir.combine([])).toEmit ['<end:current>']

  it 'should be ended if array of ended observables provided', ->
    a = send(stream(), ['<end>'])
    b = send(prop(), ['<end>'])
    c = send(stream(), ['<end>'])
    expect(Kefir.combine([a, b, c])).toEmit ['<end:current>']
    expect(a.combine(b)).toEmit ['<end:current>']

  it 'should be ended and has current if array of ended properties provided and each of them has current', ->
    a = send(prop(), [1, '<end>'])
    b = send(prop(), [2, '<end>'])
    c = send(prop(), [3, '<end>'])
    expect(Kefir.combine([a, b, c])).toEmit [{current: [1, 2, 3]}, '<end:current>']
    expect(a.combine(b)).toEmit [{current: [1, 2]}, '<end:current>']

  it 'should activate sources', ->
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.combine([a, b, c])).toActivate(a, b, c)
    expect(a.combine(b)).toActivate(a, b)

  it 'should handle events and current from observables', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    expect(Kefir.combine([a, b, c])).toEmit [[1, 0, 2], [1, 3, 2], [1, 4, 2], [1, 4, 5], [1, 4, 6], '<end>'], ->
      send(a, [1])
      send(c, [2])
      send(b, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])
    a = stream()
    b = send(prop(), [0])
    expect(a.combine(b)).toEmit [[1, 0], [1, 2], [1, 3], '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(a, ['<end>'])
      send(b, [3, '<end>'])

  it 'should accept optional combinator function', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    join = (args...) -> args.join('+')
    expect(Kefir.combine([a, b, c], join)).toEmit ['1+0+2', '1+3+2', '1+4+2', '1+4+5', '1+4+6', '<end>'], ->
      send(a, [1])
      send(c, [2])
      send(b, [3])
      send(a, ['<end>'])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])
    a = stream()
    b = send(prop(), [0])
    expect(a.combine(b, join)).toEmit ['1+0', '1+2', '1+3', '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(a, ['<end>'])
      send(b, [3, '<end>'])

  it 'when activating second time and has 2+ properties in sources, should emit current value at most once', ->
    a = send(prop(), [0])
    b = send(prop(), [1])
    cb = Kefir.combine([a, b])
    activate(cb)
    deactivate(cb)
    expect(cb).toEmit [{current: [0, 1]}]
