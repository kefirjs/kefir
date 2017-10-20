{stream, prop, send} = require('../test-helpers.coffee')




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





