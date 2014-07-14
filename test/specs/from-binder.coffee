Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.fromBinder(subscribe)', ->

  it '`subscribe` fn should be called on each activation', ->
    calls = 0
    p = Kefir.fromBinder -> calls++
    expect(calls).toBe(0)
    p.on 'value', (f = ->)
    expect(calls).toBe(1)
    p.off 'value', f
    p.on 'value', f
    expect(calls).toBe(2)

  it '`unsubscribe` fn should be called on each deactivation', ->
    calls = 0
    p = Kefir.fromBinder ->
      -> calls++
    expect(calls).toBe(0)
    p.on 'value', (f = ->)
    expect(calls).toBe(0)
    p.off 'value', f
    expect(calls).toBe(1)
    p.on 'value', f
    p.off 'value', f
    expect(calls).toBe(2)

  it '`send` fn passed to `subscribe` should send *values* to property', ->
    curSend = null
    p = Kefir.fromBinder (send) ->
      curSend = send
      -> curSend = null
    state = watch(p)
    expect(state).toEqual({values:[],errors:[]})
    expect(p).toHasNoValue()
    curSend('value', 1)
    expect(state).toEqual({values:[1],errors:[]})
    expect(p).toHasValue(1)

  it '`send` fn passed to `subscribe` should send *errors* to property', ->
    curSend = null
    p = Kefir.fromBinder (send) ->
      curSend = send
      -> curSend = null
    state = watch(p)
    expect(state).toEqual({values:[],errors:[]})
    expect(p).toHasNoError()
    curSend('error', 1)
    expect(state).toEqual({values:[],errors:[1]})
    expect(p).toHasError(1)

  it '`send` fn passed to `subscribe` should send *end* to property', ->
    curSend = null
    p = Kefir.fromBinder (send) ->
      curSend = send
      -> curSend = null
    state = watch(p)
    expect(state).toEqual({values:[],errors:[]})
    expect(p).toHasNoEnd()
    curSend('end', 1)
    expect(state).toEqual({values:[],errors:[],end:1})
    expect(p).toHasEnd(1)

  it 'deliver current *value*', ->
    p = Kefir.fromBinder (send) ->
      send('value', 1)
      send('value', 2)
    log = []
    logger = (a, b) -> log.push([a, b])
    p.watch('value', logger)
    expect(log).toEqual([[2, true]])


  it 'deliver current *value*, *error*, *end*', ->
    p = Kefir.fromBinder (send) ->
      send('value', 1)
      send('value', 2)
      send('error', 3)
      send('error', 4)
      send('end', 5)
      send('end', 6)
    log = []
    logger = (a, b, c) -> log.push([a, b, c])
    p.watch('any', logger)
    expect(log).toEqual([['value', 2, true], ['error', 4, true], ['end', 5, true]])

