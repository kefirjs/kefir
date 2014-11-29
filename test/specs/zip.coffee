{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'zip', ->

  it 'should return stream', ->
    expect(Kefir.zip([])).toBeStream()
    expect(Kefir.zip([stream(), prop()])).toBeStream()
    expect(stream().zip(stream())).toBeStream()
    expect(prop().zip(prop())).toBeStream()

  it 'should be ended if empty array provided', ->
    expect(Kefir.zip([])).toEmit ['<end:current>']

  it 'should be ended if array of ended observables provided', ->
    a = send(stream(), ['<end>'])
    b = send(prop(), ['<end>'])
    c = send(stream(), ['<end>'])
    expect(Kefir.zip([a, b, c])).toEmit ['<end:current>']
    expect(a.zip(b)).toEmit ['<end:current>']

  it 'should be ended and has current if array of ended properties provided and each of them has current', ->
    a = send(prop(), [1, '<end>'])
    b = send(prop(), [2, '<end>'])
    c = send(prop(), [3, '<end>'])
    expect(Kefir.zip([a, b, c])).toEmit [{current: [1, 2, 3]}, '<end:current>']
    expect(a.zip(b)).toEmit [{current: [1, 2]}, '<end:current>']

  it 'should activate sources', ->
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.zip([a, b, c])).toActivate(a, b, c)
    expect(a.zip(b)).toActivate(a, b)

  it 'should handle events and current from observables', ->
    a = stream()
    b = send(prop(), [0])
    c = stream()
    # a   --1---4-------6-7--------X
    # b  0---2------------------9X
    # c   ----3-------5-------8------X
    #     ----•-------•---------•----X
    #   [1,0,3] [4,2,5]   [6,9,8]
    expect(Kefir.zip([a, b, c])).toEmit [[1,0,3], [4,2,5], [6,9,8], '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4])
      send(c, [5])
      send(a, [6, 7])
      send(c, [8])
      send(b, [9, '<end>'])
      send(a, ['<end>'])
      send(c, ['<end>'])

    a = stream()
    b = send(prop(), [0])
    expect(a.zip(b)).toEmit [[1,0], [3,2], '<end>'], ->
      send(b, [2])
      send(a, [1, 3, '<end>'])
      send(b, ['<end>'])


  it 'should accept optional combinator function', ->
    join = (args...) -> args.join('+')
    a = stream()
    b = send(prop(), [0])
    c = stream()
    expect(Kefir.zip([a, b, c], join)).toEmit ['1+0+3', '4+2+5', '6+9+8', '<end>'], ->
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4])
      send(c, [5])
      send(a, [6, 7])
      send(c, [8])
      send(b, [9, '<end>'])
      send(a, ['<end>'])
      send(c, ['<end>'])

    a = stream()
    b = send(prop(), [0])
    expect(a.zip(b, join)).toEmit ['1+0', '3+2', '<end>'], ->
      send(b, [2])
      send(a, [1, 3, '<end>'])
      send(b, ['<end>'])



  it 'when activating second time and has 2+ properties in sources, should emit current value at most once', ->
    a = send(prop(), [0])
    b = send(prop(), [1])
    cb = Kefir.zip([a, b])
    activate(cb)
    deactivate(cb)
    expect(cb).toEmit [{current: [0, 1]}]
