Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.skipWhile()', ->

  lessThan3 = (x) -> x < 3

  it 'should end when source ends', ->
    p = prop()
    tp = p.skipWhile(lessThan3)
    expect(tp).toNotBeEnded()
    send(p, 'end')
    expect(tp).toBeEnded()

  it 'should pass initial *value* if they not satisfies condition', ->
    expect(  prop(10).skipWhile(lessThan3)  ).toHasValue(10)

  it 'should not pass initial *value* if they do satisfies condition', ->
    expect(  prop(2).skipWhile(lessThan3)  ).toHasNoValue()

  it 'should handle initial *error*', ->
    expect(  prop(null, 1).skipWhile(lessThan3)  ).toHasError(1)

  it 'should handle further *errors*', ->
    p = prop()
    state = watch(p.skipWhile(lessThan3))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3],ended:false})

  it 'should activate/deactivate source property', ->
    p = prop()
    tp = p.skipWhile(lessThan3)
    expect(p).toNotBeActive()
    tp.on 'value', (f = ->)
    expect(p).toBeActive()
    tp.off 'value', f
    expect(p).toNotBeActive()

  it 'should skip first values that satisfies condition but pass any further', ->
    p = prop()
    state = watch(p.skipWhile(lessThan3))
    send(p, 'value', 1)
    send(p, 'value', 2)
    send(p, 'value', 3)
    send(p, 'value', 2)
    send(p, 'value', 1)
    expect(state).toEqual({values:[3,2,1],errors:[],ended:false})
