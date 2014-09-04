Kefir = require('kefir')
{activate, deactivate} = require('../test-helpers.coffee')


describe 'fromBinder', ->

  it 'should return stream', ->
    expect(Kefir.fromBinder(->)).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.fromBinder(->)).toEmit []

  it 'should emit values and end', ->
    emitter = null
    a = Kefir.fromBinder (em) ->
      emitter = em
      null
    expect(a).toEmit [1, 2, 3, '<end>'], ->
      emitter.emit(1)
      emitter.emit(2)
      emitter.emit(3)
      emitter.end()

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


  it 'should automatically controll isCurent argument in `send`', ->

    expect(
      Kefir.fromBinder (emitter) ->
        emitter.end()
    ).toEmit ['<end:current>']

    expect(
      Kefir.fromBinder  (emitter) ->
        emitter.emit(1)
        emitter.emit(2)
        setTimeout ->
          emitter.emit(2)
          emitter.end()
        , 1000
    ).toEmitInTime [[0, {current: 1}], [0, {current: 2}], [1000, 2], [1000, '<end>']]







