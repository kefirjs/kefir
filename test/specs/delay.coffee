Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, withFakeTime, activate} = helpers


describe '.delay()', ->

  it 'should end after timeout when source ends', ->
    withFakeTime (clock) ->
      p = prop()
      delayed = activate(p.delay(100))
      expect(delayed).toNotBeEnded()
      send(p, 'end')
      expect(delayed).toNotBeEnded()
      clock.tick(101)
      expect(delayed).toBeEnded()

  it 'should pass current *value*', ->
    expect(  activate(prop(1).delay(100))  ).toHasValue(1)

  it 'should pass current *error*', ->
    expect(  activate(prop(null, 1).delay(100))  ).toHasError(1)

  it 'should pass further *errors* without timeout', ->
    p = prop()
    state = watch(p.delay(100))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3]})

  it 'should activate/deactivate source property', ->
    p = prop()
    delayed = p.delay(100)
    expect(p).toNotBeActive()
    delayed.on 'value', (f = ->)
    expect(p).toBeActive()
    delayed.off 'value', f
    expect(p).toNotBeActive()

  it 'should deliver values with timeout', ->
    withFakeTime (clock) ->
      p = prop()
      state = watch(p.delay(100))
      send(p, 'value', 1)
      expect(state.values).toEqual([])
      clock.tick(30)
      send(p, 'value', 2)
      expect(state.values).toEqual([])
      clock.tick(71)
      expect(state.values).toEqual([1])
      clock.tick(30)
      expect(state.values).toEqual([1,2])
