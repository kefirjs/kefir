Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.skip()', ->

  it 'should end when source ends', ->
    p = prop()
    tp = p.skip(5)
    expect(tp).toNotBeEnded()
    send(p, 'end')
    expect(tp).toBeEnded()

  it 'should handle initial *value* if n == 0', ->
    expect(  prop(1).skip(0)  ).toHasValue(1)

  it 'should not handle initial *value* if n > 0', ->
    expect(  prop(1).skip(1)  ).toHasNoValue()

  it 'should handle initial *error* whether n > 0 or not', ->
    expect(  prop(null, 1).skip(1)  ).toHasError(1)
    expect(  prop(null, 1).skip(0)  ).toHasError(1)

  it 'should handle further *errors*', ->
    p = prop()
    state = watch(p.skip(2))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3],ended:false})

  it 'should activate/deactivate source property', ->
    p = prop()
    tp = p.skip(5)
    expect(p).toNotBeActive()
    tp.on 'value', (f = ->)
    expect(p).toBeActive()
    tp.off 'value', f
    expect(p).toNotBeActive()

  it 'should skip first n values', ->
    p = prop()
    state = watch(p.skip(2))
    send(p, 'value', 1)
    send(p, 'value', 2)
    send(p, 'value', 3)
    expect(state).toEqual({values:[3],errors:[],ended:false})

  it 'should skip first n values (counting initial)', ->
    p = prop(1)
    state = watch(p.skip(2))
    send(p, 'value', 2)
    send(p, 'value', 3)
    expect(state).toEqual({values:[3],errors:[],ended:false})
