Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.scan()', ->

  subtract = (prev, next) -> prev - next

  it 'should end when source ends', ->
    p = prop()
    scaned = activate(p.scan(0, subtract))
    expect(scaned).toNotBeEnded()
    send(p, 'end')
    expect(scaned).toBeEnded()

  it 'should handle current *value*', ->
    expect(  activate(prop(2).scan(0, subtract))  ).toHasValue(-2)

  it 'if source property has no current, `seed` should became current *value* of result property', ->
    expect(  activate(prop().scan(0, subtract))  ).toHasValue(0)

  it 'should handle current *error*', ->
    expect(  activate(prop(null, 1).scan(0, subtract))  ).toHasError(1)

  it 'should activate/deactivate source property', ->
    p = prop()
    scaned = p.scan(0, subtract)
    expect(p).toNotBeActive()
    scaned.on 'value', (f = ->)
    expect(p).toBeActive()
    scaned.off 'value', f
    expect(p).toNotBeActive()

  it 'should handle all values and errors', ->
    p = prop(1, 'a')
    state = watch(p.scan(0, subtract))
    send(p, 'value', 3)
    send(p, 'error', 'b')
    send(p, 'value', 6)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[-1,-4,-10],errors:['a','b','c']})

  it 'should handle all values and errors (without current)', ->
    p = prop()
    state = watch(p.scan(0, subtract))
    send(p, 'value', 3)
    send(p, 'error', 'b')
    send(p, 'value', 6)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[0,-3,-9],errors:['b','c']})
