Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.takeWhile()', ->

  lessThan3 = (x) -> x < 3

  it 'should end when source ends', ->
    p = prop()
    tp = activate(p.takeWhile(lessThan3))
    expect(tp).toNotBeEnded()
    send(p, 'end')
    expect(tp).toBeEnded()

  it 'should handle initial *value*', ->
    expect(  activate(prop(1).takeWhile(lessThan3))  ).toHasValue(1)

  it 'should handle initial *error*', ->
    expect(  activate(prop(null, 1).takeWhile(lessThan3))  ).toHasError(1)

  it 'should handle further *errors*', ->
    p = prop()
    state = watch(p.takeWhile(lessThan3))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3]})

  it 'should activate/deactivate source property', ->
    p = prop()
    tp = p.takeWhile(lessThan3)
    expect(p).toNotBeActive()
    tp.on 'value', (f = ->)
    expect(p).toBeActive()
    tp.off 'value', f
    expect(p).toNotBeActive()

  it 'should take first n values then end', ->
    p = prop()
    state = watch(p.takeWhile(lessThan3))
    send(p, 'value', 1)
    send(p, 'value', 2)
    send(p, 'value', 3)
    expect(state).toEqual({values:[1,2],errors:[],end:undefined})

  it 'if initial value not satisfies condition should end without any initial value', ->
    p = prop(10)
    tp = activate(p.takeWhile(lessThan3))
    expect(tp).toBeEnded()
    expect(tp).toHasNoValue()
