{activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'Kefir.stream', ->

  it 'should return stream', ->
    expect(Kefir.stream(->)).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.stream(->)).toEmit []

  it 'should emit values, errors, and end', ->
    emitter = null
    a = Kefir.stream (em) ->
      emitter = em
      null
    expect(a).toEmit [1, 2, {error: -1}, 3, '<end>'], ->
      emitter.next(1)
      emitter.next(2)
      emitter.error(-1)
      emitter.next(3)
      emitter.complete()

  it 'should call `subscribe` / `unsubscribe` on activation / deactivation', ->
    subCount = 0
    unsubCount = 0
    a = Kefir.stream ->
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
      Kefir.stream (emitter) ->
        emitter.complete()
        null
    ).toEmit ['<end:current>']

    expect(
      Kefir.stream  (emitter) ->
        emitter.next(1)
        emitter.error(-1)
        emitter.next(2)
        setTimeout ->
          emitter.next(2)
          emitter.complete()
        , 1000
        null
    ).toEmitInTime [[0, {current: 1}], [0, {currentError: -1}], [0, {current: 2}], [1000, 2], [1000, '<end>']]


  it 'should support emitter.emitEvent', ->
    expect(
      Kefir.stream  (emitter) ->
        emitter.emitEvent({type: 'value', value: 1, current: true})
        emitter.emitEvent({type: 'error', value: -1, current: false})
        emitter.emitEvent({type: 'value', value: 2, current: false})
        setTimeout ->
          emitter.emitEvent({type: 'value', value: 3, current: true})
          emitter.emitEvent({type: 'value', value: 4, current: false})
          emitter.emitEvent({type: 'end', value: undefined, current: false})
        , 1000
        null
    ).toEmitInTime [[0, {current: 1}], [0, {currentError: -1}], [0, {current: 2}], [1000, 3], [1000, 4], [1000, '<end>']]


  # https://github.com/rpominov/kefir/issues/35
  it 'should work with .take(1) and sync emit', ->

    log = []

    a = Kefir.stream (emitter) ->
      logRecord = {sub: 1, unsub: 0}
      log.push(logRecord)
      emitter.next(1)
      -> logRecord.unsub++

    a.take(1).onValue ->
    a.take(1).onValue ->

    expect(log).toEqual [
      {sub: 1, unsub: 1}
      {sub: 1, unsub: 1}
    ]

  it 'should not throw if not falsey but not a function returned', ->
    expect(Kefir.stream(-> true)).toEmit []

  it 'emitter should return a boolean representing if anyone intrested in future events', ->
    emitter = null
    a = Kefir.stream (em) ->
      emitter = em
    activate(a)
    expect(emitter.next(1)).toBe(true)
    deactivate(a)
    expect(emitter.next(1)).toBe(false)

    a = Kefir.stream (em) ->
      expect(em.next(1)).toBe(true)
      expect(em.next(2)).toBe(false)
      expect(em.next(3)).toBe(false)
    lastX = null
    f = (x) ->
      lastX = x
      if x == 2
        a.offValue(f)
    a.onValue(f)
    expect(lastX).toBe(2)

  it 'calling emitter.complete() in undubscribe() should work fine', ->
    em = null
    s = Kefir.stream (_em) ->
      em = _em
      ->
        em.complete()
    s.onValue(->)
    em.next(1)
    em.complete()






