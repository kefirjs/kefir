Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.withHandler()', ->


  it 'should not end when source ends (by default)', ->
    p = prop()
    wh = p.withHandler(->)
    expect(wh).toNotBeEnded()
    send(p, 'end')
    expect(wh).toNotBeEnded()

  it 'should not pass initial *value* (by default)', ->
    expect(  prop(1).withHandler(->)  ).toHasNoValue()

  it 'should not pass initial *error* (by default)', ->
    expect(  prop(null, 1).withHandler(->)  ).toHasNoError()

  it 'should activate/deactivate source property', ->
    p = prop()
    wh = p.withHandler(->)
    expect(p).toNotBeActive()
    wh.on 'value', (f = ->)
    expect(p).toBeActive()
    wh.off 'value', f
    expect(p).toNotBeActive()

  it 'should pass no values or errors (by default)', ->
    p = prop(1, 'a')
    state = watch(p.withHandler(->))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[],errors:[],ended:false})



  mirror = (send, type, x) -> send(type, x)

  it 'should end when source ends (with `mirror` handler)', ->
    p = prop()
    wh = p.withHandler(mirror)
    expect(wh).toNotBeEnded()
    send(p, 'end')
    expect(wh).toBeEnded()

  it 'should pass initial *value* (with `mirror` handler)', ->
    expect(  prop(1).withHandler(mirror)  ).toHasValue(1)

  it 'should pass initial *error* (with `mirror` handler)', ->
    expect(  prop(null, 1).withHandler(mirror)  ).toHasError(1)

  it 'should pass all values or errors (with `mirror` handler)', ->
    p = prop(1, 'a')
    state = watch(p.withHandler(mirror))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[1,2,3],errors:['a','b','c'],ended:false})




  skipInitial = (send, type, x, isInitial) ->
    unless isInitial
      send(type, x)

  it 'should end when source ends (with `skipInitial` handler)', ->
    p = prop()
    wh = p.withHandler(skipInitial)
    expect(wh).toNotBeEnded()
    send(p, 'end')
    expect(wh).toBeEnded()

  it 'should not pass initial *value* (with `skipInitial` handler)', ->
    expect(  prop(1).withHandler(skipInitial)  ).toHasNoValue()

  it 'should not pass initial *error* (with `skipInitial` handler)', ->
    expect(  prop(null, 1).withHandler(skipInitial)  ).toHasNoError()

  it 'should pass all but initial values or errors (with `skipInitial` handler)', ->
    p = prop(1, 'a')
    state = watch(p.withHandler(skipInitial))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[2,3],errors:['b','c'],ended:false})

