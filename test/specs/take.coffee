Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.take()', ->

  it 'should end when source ends', ->
    p = prop()
    tp = activate(p.take(5))
    expect(tp).toNotBeEnded()
    send(p, 'end')
    expect(tp).toBeEnded()

  it 'should handle initial *value*', ->
    expect(  activate(prop(1).take(5))  ).toHasValue(1)

  it 'should handle initial *error*', ->
    expect(  activate(prop(null, 1).take(5))  ).toHasError(1)

  it 'should handle further *errors*', ->
    p = prop()
    state = watch(p.take(2))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3]})

  it 'should activate/deactivate source property', ->
    p = prop()
    tp = p.take(5)
    expect(p).toNotBeActive()
    tp.on 'value', (f = ->)
    expect(p).toBeActive()
    tp.off 'value', f
    expect(p).toNotBeActive()

  it 'should take first n values then end', ->
    p = prop()
    state = watch(p.take(3))
    send(p, 'value', 1)
    send(p, 'value', 2)
    send(p, 'value', 3)
    expect(state).toEqual({values:[1,2,3],errors:[],end:undefined})

  it 'should take first n values (counting initial) then end', ->
    p = prop(1)
    state = watch(p.take(3))
    send(p, 'value', 2)
    send(p, 'value', 3)
    expect(state).toEqual({values:[1,2,3],errors:[],end:undefined})

  it 'should end immediately if n == 0', ->
    p = prop(1)
    state = watch(p.take(0))
    expect(state).toEqual({values:[],errors:[],end:undefined})

  it 'should end immediately if n == -1', ->
    p = prop(1)
    state = watch(p.take(-1))
    expect(state).toEqual({values:[],errors:[],end:undefined})

