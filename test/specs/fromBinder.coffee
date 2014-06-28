Kefir = require('../../dist/kefir')
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
    expect(state).toEqual({values:[],errors:[],ended:false})
    expect(p).toHasNoValue()
    curSend('value', 1)
    expect(state).toEqual({values:[1],errors:[],ended:false})
    expect(p).toHasValue(1)

  it '`send` fn passed to `subscribe` should send *errors* to property', ->
    curSend = null
    p = Kefir.fromBinder (send) ->
      curSend = send
      -> curSend = null
    state = watch(p)
    expect(state).toEqual({values:[],errors:[],ended:false})
    expect(p).toHasNoError()
    curSend('error', 1)
    expect(state).toEqual({values:[],errors:[1],ended:false})
    expect(p).toHasError(1)

  it '`send` fn passed to `subscribe` should send *end* to property', ->
    curSend = null
    p = Kefir.fromBinder (send) ->
      curSend = send
      -> curSend = null
    state = watch(p)
    expect(state).toEqual({values:[],errors:[],ended:false})
    expect(p).toNotBeEnded()
    curSend('end')
    expect(state).toEqual({values:[],errors:[],ended:true})
    expect(p).toBeEnded()

