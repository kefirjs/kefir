{stream, prop, send, Kefir} = require('../test-helpers.coffee')



expectToBehaveAsMap = (gen, mapFn, toObj = (x) -> x) ->

  mapEv = (events, mapFn) ->
    for event in events
      if event == '<end>'
        '<end>'
      else if event?.current?
        {current: mapFn(event.current)}
      else
        mapFn(event)

  describe 'stream', ->

    it 'should return stream', ->
      expect(gen stream()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(gen a).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(gen send(stream(), ['<end>'])).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(gen a).toEmit mapEv(mapEv([1, 2, '<end>'], toObj), mapFn), ->
        send(a, mapEv([1, 2, '<end>'], toObj))

  describe 'property', ->

    it 'should return property', ->
      expect(gen prop()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(gen a).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(gen send(prop(), ['<end>'])).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [toObj(1)])
      expect(gen a).toEmit mapEv(mapEv([{current: 1}, 2, 3, '<end>'], toObj), mapFn), ->
        send(a, mapEv([2, 3, '<end>'], toObj))

describe 'mapTo', ->
  expectToBehaveAsMap(
    (s) -> s.mapTo(1)
    -> 1
  )

describe 'not', ->
  expectToBehaveAsMap(
    (s) -> s.not()
    (x) -> !x
  )

describe 'pluck', ->
  expectToBehaveAsMap(
    (s) -> s.pluck('foo')
    (x) -> x.foo
    (x) -> {foo: x}
  )

describe 'invoke w/o args', ->
  expectToBehaveAsMap(
    (s) -> s.invoke('bar')
    (x) -> x.bar()
    (x) -> {foo: x, bar: -> @foo}
  )

describe 'invoke w/ args', ->
  expectToBehaveAsMap(
    (s) -> s.invoke('bar', 1, 2)
    (x) -> x.bar(1, 2)
    (x) -> {foo: x, bar: (a, b) -> @foo + a + b}
  )

describe 'tap', ->
  expectToBehaveAsMap(
    (s) -> s.tap (x) -> x.foo += 1
    (x) -> x.foo += 1; x
    (x) -> {foo: x}
  )




describe 'setName', ->

  it 'should return same observable', ->
    a = stream()
    expect(a.setName('foo')).toBe(a)
    expect(a.setName(stream(), 'foo')).toBe(a)

  it 'should update observable name', ->
    a = stream()
    expect(a.toString()).toBe('[stream]')
    a.setName('foo')
    expect(a.toString()).toBe('[foo]')
    a.setName(stream().setName('foo'), 'bar')
    expect(a.toString()).toBe('[foo.bar]')





describe 'defer', ->

  it 'should not emit synchronously', ->
    a = stream()
    expect(a.defer()).toEmit [], ->
      send(a, [1, 2, '<end>'])

  it 'should emit asynchronously without timeout', ->
    a = stream()
    expect(a.defer()).toEmitInTime [[0, 1], [0, 2], [0, '<end>']], ->
      send(a, [1, 2, '<end>'])




describe 'and', ->

  it 'should work as expected', ->
    a = stream()
    b = prop()
    c = send(prop(), [1])
    expect(Kefir.and [a, b, c]).toEmit [false, false, 10, 11, 0], ->
      send(a, [true])
      send(b, [false])
      send(c, [10])
      send(b, [1])
      send(c, [11])
      send(a, [0])




describe 'or', ->

  it 'should work as expected', ->
    a = stream()
    b = prop()
    c = send(prop(), [1])
    expect(Kefir.or [a, b, c]).toEmit [true, 1, 2, 1, 11], ->
      send(a, [true])
      send(b, [false])
      send(a, [0])
      send(b, [2, false])
      send(c, [11])




describe 'awaiting', ->

  it 'stream and stream', ->
    a = stream()
    b = stream()
    expect(a.awaiting(b)).toEmit [{current: false}, true, false, true], ->
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      send(a, [1])

  it 'property and stream', ->
    a = send(prop(), [1])
    b = stream()
    expect(a.awaiting(b)).toEmit [{current: true}, false, true], ->
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      send(a, [1])

  it 'property and property', ->
    a = send(prop(), [1])
    b = send(prop(), [1])
    expect(a.awaiting(b)).toEmit [{current: false}, true, false, true], ->
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      send(a, [1])




describe 'filterBy', ->

  it 'should work as expected', ->
    a = stream()
    b = stream()

    expect(a.filterBy(b)).toEmit [3, 4, 7, 8, '<end>'], ->
      send(a, [1, 2]) # ignored as B has no value yet
      send(b, [true])
      send(a, [3, 4]) # passed
      send(b, [0])
      send(a, [5, 6]) # dropped
      send(b, [1])
      send(a, [7, 8]) # passed
      send(b, [false])
      send(a, [9, '<end>']) # 9 dropped, <end> passed

  it 'should preserve current', ->
    a = send(prop(), [1]);
    b = send(prop(), [2]);
    expect(a.filterBy(b)).toEmit [{current: 1}]




