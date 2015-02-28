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

  it 'errors should flow', ->
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.combine([a, b, c])).errorsToFlow(a)
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.combine([a, b, c])).errorsToFlow(b)
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.combine([a, b, c])).errorsToFlow(c)



  describe 'sampledBy functionality (3 arity combine)', ->

    it 'should return stream', ->
      expect(Kefir.combine([], [])).toBeStream()
      expect(Kefir.combine([stream(), prop()], [stream(), prop()])).toBeStream()

    it 'should be ended if empty array provided', ->
      expect(Kefir.combine([stream(), prop()], [])).toEmit []
      expect(Kefir.combine([], [stream(), prop()])).toEmit ['<end:current>']

    it 'should be ended if array of ended observables provided', ->
      a = send(stream(), ['<end>'])
      b = send(prop(), ['<end>'])
      c = send(stream(), ['<end>'])
      expect(Kefir.combine([a, b, c], [stream(), prop()])).toEmit ['<end:current>']

    it 'should be ended and emmit current (once) if array of ended properties provided and each of them has current', ->
      a = send(prop(), [1, '<end>'])
      b = send(prop(), [2, '<end>'])
      c = send(prop(), [3, '<end>'])
      s1 = Kefir.combine([a, b], [c])
      expect(s1).toEmit [{current: [1, 2, 3]}, '<end:current>']
      expect(s1).toEmit ['<end:current>']

    it 'should activate sources', ->
      a = stream()
      b = prop()
      c = stream()
      expect(Kefir.combine([a, b], [c])).toActivate(a, b, c)

    it 'should handle events and current from observables', ->
      a = stream()
      b = send(prop(), [0])
      c = stream()
      d = stream()
      expect(Kefir.combine([c, d], [a, b])).toEmit [[2, 3, 1, 0], [5, 3, 1, 4], [6, 3, 1, 4], [6, 7, 1, 4], '<end>'], ->
        send(a, [1])
        send(c, [2])
        send(d, [3])
        send(b, [4, '<end>'])
        send(c, [5, 6, '<end>'])
        send(d, [7, '<end>'])


    it 'should accept optional combinator function', ->
      join = (args...) -> args.join('+')
      a = stream()
      b = send(prop(), [0])
      c = stream()
      d = stream()
      expect(Kefir.combine([c, d], [a, b], join)).toEmit ['2+3+1+0', '5+3+1+4', '6+3+1+4', '6+7+1+4', '<end>'], ->
        send(a, [1])
        send(c, [2])
        send(d, [3])
        send(b, [4, '<end>'])
        send(c, [5, 6, '<end>'])
        send(d, [7, '<end>'])


    it 'when activating second time and has 2+ properties in sources, should emit current value at most once', ->
      a = send(prop(), [0])
      b = send(prop(), [1])
      c = send(prop(), [2])
      sb = Kefir.combine([a, b], [c])
      activate(sb)
      deactivate(sb)
      expect(sb).toEmit [{current: [0, 1, 2]}]

    it 'errors should flow', ->
      a = stream()
      b = prop()
      c = stream()
      d = prop()
      expect(Kefir.combine([a, b], [c, d])).errorsToFlow(a)
      a = stream()
      b = prop()
      c = stream()
      d = prop()
      expect(Kefir.combine([a, b], [c, d])).errorsToFlow(b)
      a = stream()
      b = prop()
      c = stream()
      d = prop()
      expect(Kefir.combine([a, b], [c, d])).errorsToFlow(c)
      a = stream()
      b = prop()
      c = stream()
      d = prop()
      expect(Kefir.combine([a, b], [c, d])).errorsToFlow(d)
