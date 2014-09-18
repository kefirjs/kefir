{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'sampledBy', ->

  it 'should return stream', ->
    expect(Kefir.sampledBy([], [])).toBeStream()
    expect(Kefir.sampledBy([stream(), prop()], [stream(), prop()])).toBeStream()
    expect(prop().sampledBy(stream())).toBeStream()
    expect(stream().sampledBy(prop())).toBeStream()

  it 'should be ended if empty array provided', ->
    expect(Kefir.sampledBy([stream(), prop()], [])).toEmit ['<end:current>']
    expect(Kefir.sampledBy([], [stream(), prop()])).toEmit []

  it 'should be ended if array of ended observables provided', ->
    a = send(stream(), ['<end>'])
    b = send(prop(), ['<end>'])
    c = send(stream(), ['<end>'])
    expect(Kefir.sampledBy([stream(), prop()], [a, b, c])).toEmit ['<end:current>']
    expect(prop().sampledBy(a)).toEmit ['<end:current>']

  it 'should be ended and emmit current (once) if array of ended properties provided and each of them has current', ->
    a = send(prop(), [1, '<end>'])
    b = send(prop(), [2, '<end>'])
    c = send(prop(), [3, '<end>'])
    s1 = Kefir.sampledBy([a], [b, c])
    s2 = a.sampledBy(b)
    expect(s1).toEmit [{current: [1, 2, 3]}, '<end:current>']
    expect(s2).toEmit [{current: [1, 2]}, '<end:current>']
    expect(s1).toEmit ['<end:current>']
    expect(s2).toEmit ['<end:current>']

  it 'should activate sources', ->
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.sampledBy([a], [b, c])).toActivate(a, b, c)
    expect(a.sampledBy(b)).toActivate(a, b)

  it 'should handle events and current from observables', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    d = stream()
    expect(Kefir.sampledBy([a, b], [c, d])).toEmit [[1, 0, 2, 3], [1, 4, 5, 3], [1, 4, 6, 3], [1, 4, 6, 7], '<end>'], ->
      send(a, [1])
      send(c, [2])
      send(d, [3])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])
      send(d, [7, '<end>'])
    a = stream()
    b = send(prop(), [0])
    expect(a.sampledBy(b)).toEmit [[2, 3], [4, 5], [4, 6], '<end>'], ->
      send(b, [1])
      send(a, [2])
      send(b, [3])
      send(a, [4])
      send(b, [5, 6, '<end>'])

  it 'should accept optional combinator function', ->
    join = (args...) -> args.join('+')
    a = stream()
    b = send(prop(), [0])
    c = stream()
    d = stream()
    expect(Kefir.sampledBy([a, b], [c, d], join)).toEmit ['1+0+2+3', '1+4+5+3', '1+4+6+3', '1+4+6+7', '<end>'], ->
      send(a, [1])
      send(c, [2])
      send(d, [3])
      send(b, [4, '<end>'])
      send(c, [5, 6, '<end>'])
      send(d, [7, '<end>'])
    a = stream()
    b = send(prop(), [0])
    expect(a.sampledBy(b, join)).toEmit ['2+3', '4+5', '4+6', '<end>'], ->
      send(b, [1])
      send(a, [2])
      send(b, [3])
      send(a, [4])
      send(b, [5, 6, '<end>'])

  it 'when activating second time and has 2+ properties in sources, should emit current value at most once', ->
    a = send(prop(), [0])
    b = send(prop(), [1])
    c = send(prop(), [2])
    sb = Kefir.sampledBy([a], [b, c])
    activate(sb)
    deactivate(sb)
    expect(sb).toEmit [{current: [0, 1, 2]}]
