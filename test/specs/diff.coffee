Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.diff()', ->

  subtract = (prev, next) -> prev - next

  it 'should end when source ends', ->
    p = prop()
    diffed = activate(p.diff(0, subtract))
    expect(diffed).toNotBeEnded()
    send(p, 'end')
    expect(diffed).toBeEnded()

  it 'should handle current *value*', ->
    expect(  activate(prop(2).diff(0, subtract))  ).toHasValue(-2)

  it 'should handle current *error*', ->
    expect(  activate(prop(null, 1).diff(0, subtract))  ).toHasError(1)

  it 'should activate/deactivate source property', ->
    p = prop()
    diffed = p.diff(0, subtract)
    expect(p).toNotBeActive()
    diffed.on 'value', (f = ->)
    expect(p).toBeActive()
    diffed.off 'value', f
    expect(p).toNotBeActive()

  it 'should handle all values and errors', ->
    p = prop(1, 'a')
    state = watch(p.diff(0, subtract))
    send(p, 'value', 3)
    send(p, 'error', 'b')
    send(p, 'value', 6)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[-1,-2,-3],errors:['a','b','c']})

  it 'should handle all values and errors (without current)', ->
    p = prop()
    state = watch(p.diff(0, subtract))
    send(p, 'value', 3)
    send(p, 'error', 'b')
    send(p, 'value', 6)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[-3,-3],errors:['b','c']})
