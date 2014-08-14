Kefir = require('kefir')
{activate, deactivate} = require('../test-helpers.coffee')


describe 'fromBinder', ->

  it 'should return stream', ->
    expect(Kefir.fromBinder(->)).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.fromBinder(->)).toEmit []

  it 'should emit values and end', ->
    send = null
    a = Kefir.fromBinder (s) ->
      send = s
      null
    expect(a).toEmit [1, 2, 3, '<end>'], ->
      send('value', 1)
      send('value', 2)
      send('value', 3)
      send('end')

  it 'should call `subscribe` / `unsubscribe` on activation / deactivation', ->
    subCount = 0
    unsubCount = 0
    a = Kefir.fromBinder ->
      subCount++
      -> unsubCount++
    expect(subCount).toBe(0)
    expect(unsubCount).toBe(0)
    activate(a)
    expect(subCount).toBe(1)
    activate(a)
    expect(subCount).toBe(1)
    deactivate(a)
    expect(unsubCount).toBe(0)
    deactivate(a)
    expect(unsubCount).toBe(1)
    expect(subCount).toBe(1)
    activate(a)
    expect(subCount).toBe(2)
    expect(unsubCount).toBe(1)
    deactivate(a)
    expect(unsubCount).toBe(2)







