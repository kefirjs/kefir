Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, withFakeTime} = helpers


describe '.throttle()', ->

  it 'should end when source ends', ->
    p = prop()
    throttled = p.throttle(100)
    expect(throttled).toNotBeEnded()
    send(p, 'end')
    expect(throttled).toBeEnded()

  it 'should always pass initial *value*', ->
    expect(  prop(1).throttle(100)  ).toHasValue(1)
    expect(  prop(1).throttle(100, {leading: false})  ).toHasValue(1)
    expect(  prop(1).throttle(100, {trailing: false})  ).toHasValue(1)
    expect(  prop(1).throttle(100, {trailing: false, leading: false})  ).toHasValue(1)

  it 'should pass initial *error*', ->
    expect(  prop(null, 1).throttle(100)  ).toHasError(1)

  it 'should pass further *errors*', ->
    p = prop()
    state = watch(p.throttle(100))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3],ended:false})

  it 'should activate/deactivate source property', ->
    p = prop()
    throttled = p.throttle(100)
    expect(p).toNotBeActive()
    throttled.on 'value', (f = ->)
    expect(p).toBeActive()
    throttled.off 'value', f
    expect(p).toNotBeActive()

  it 'should pass value from *leading* event immediately', ->
    p = prop(1)
    state = watch(p.throttle(100))
    send(p, 'value', 2)
    expect(state.values).toEqual([1,2])

  it 'if `leading` option set to false, should pass value from *leading* event after timeout', ->
    withFakeTime (clock) ->
      p = prop(1)
      state = watch(p.throttle(100, {leading: false}))
      send(p, 'value', 2)
      expect(state.values).toEqual([1])
      clock.tick(101)
      expect(state.values).toEqual([1,2])

  it 'should skip too frequent events', ->
    withFakeTime (clock) ->
      p = prop(1)
      state = watch(p.throttle(100))
      send(p, 'value', 2)
      expect(state.values).toEqual([1,2])
      clock.tick(30)
      send(p, 'value', 3)
      expect(state.values).toEqual([1,2])
      clock.tick(30)
      send(p, 'value', 4)
      expect(state.values).toEqual([1,2])
      clock.tick(41)
      expect(state.values).toEqual([1,2,4])


  it 'should wait after trailing event', ->
    withFakeTime (clock) ->
      p = prop(1)
      state = watch(p.throttle(100))
      send(p, 'value', 2)
      clock.tick(30)
      send(p, 'value', 3)
      clock.tick(71)
      expect(state.values).toEqual([1,2,3])
      send(p, 'value', 4)
      expect(state.values).toEqual([1,2,3])
      clock.tick(101)
      expect(state.values).toEqual([1,2,3,4])


  it 'should pass immediately if events not to frequent', ->
    withFakeTime (clock) ->
      p = prop(1)
      state = watch(p.throttle(100))
      send(p, 'value', 2)
      clock.tick(101)
      send(p, 'value', 3)
      expect(state.values).toEqual([1,2,3])
      clock.tick(101)
      send(p, 'value', 4)
      expect(state.values).toEqual([1,2,3,4])


  it 'should not deliver trailing events if {trailing: false}', ->
    withFakeTime (clock) ->
      p = prop(1)
      state = watch(p.throttle(100, {trailing: false}))
      send(p, 'value', 2)
      clock.tick(30)
      send(p, 'value', 3)
      expect(state.values).toEqual([1,2])
      clock.tick(500)
      expect(state.values).toEqual([1,2])


  it 'should not end until trailing event delivered', ->
    withFakeTime (clock) ->
      p = prop(1)
      state = watch(p.throttle(100))
      send(p, 'value', 2)
      clock.tick(30)
      send(p, 'value', 3)
      send(p, 'end')
      expect(state).toEqual({values:[1,2],errors:[],ended:false})
      clock.tick(71)
      expect(state).toEqual({values:[1,2,3],errors:[],ended:true})


  it 'should end rignt after source if {trailing: false}', ->
    withFakeTime (clock) ->
      p = prop(1)
      state = watch(p.throttle(100, {trailing: false}))
      send(p, 'value', 2)
      clock.tick(30)
      send(p, 'value', 3)
      send(p, 'end')
      expect(state).toEqual({values:[1,2],errors:[],ended:true})
