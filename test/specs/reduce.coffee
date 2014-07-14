Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.reduce()', ->

  subtract = (prev, next) -> prev - next

  it 'should end when source ends', ->
    p = prop()
    reduced = activate(p.reduce(0, subtract))
    expect(reduced).toNotBeEnded()
    send(p, 'end')
    expect(reduced).toBeEnded()

  it 'should not pass initial *value*', ->
    expect(  activate(prop(2).reduce(0, subtract))  ).toHasNoValue()

  it 'should pass initial *error*', ->
    expect(  activate(prop(null, 1).reduce(0, subtract))  ).toHasError(1)

  it 'should pass further *errors*', ->
    p = prop()
    state = watch(p.reduce(0, subtract))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3]})

  it 'should activate/deactivate source property', ->
    p = prop()
    reduced = p.reduce(0, subtract)
    expect(p).toNotBeActive()
    reduced.on 'value', (f = ->)
    expect(p).toBeActive()
    reduced.off 'value', f
    expect(p).toNotBeActive()

  it 'should handle all values and errors', ->
    p = prop(1, 'a')
    state = watch(p.reduce(0, subtract))
    send(p, 'value', 3)
    send(p, 'error', 'b')
    send(p, 'value', 6)
    send(p, 'error', 'c')
    send(p, 'end')
    expect(state).toEqual({values:[-10],errors:['a','b','c'],end:undefined})

  it 'should handle all values and errors (without initial)', ->
    p = prop()
    state = watch(p.reduce(0, subtract))
    send(p, 'value', 3)
    send(p, 'error', 'b')
    send(p, 'value', 6)
    send(p, 'error', 'c')
    send(p, 'end')
    expect(state).toEqual({values:[-9],errors:['b','c'],end:undefined})

  it 'should has `seed` as result value if source ends vithout any values', ->
    p = prop()
    state = watch(p.reduce(0, subtract))
    send(p, 'end')
    expect(state).toEqual({values:[0],errors:[],end:undefined})
