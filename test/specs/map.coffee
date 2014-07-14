Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.map()', ->

  x2 = (x) -> x * 2

  it 'should end when source ends', ->
    p = prop()
    mapped = activate(p.map(x2))
    expect(mapped).toNotBeEnded()
    send(p, 'end')
    expect(mapped).toBeEnded()

  it 'should be ended if source was ended', ->
    expect(  activate(send(prop(), 'end').map(x2))  ).toBeEnded()

  it 'should handle initial *value*', ->
    expect(  activate(prop(1).map(x2))  ).toHasValue(2)

  it 'should handle initial *error*', ->
    expect(  activate(prop(null, 1).map(x2))  ).toHasError(1)

  it 'should activate/deactivate source property', ->
    p = prop()
    mapped = p.map(x2)
    expect(p).toNotBeActive()
    mapped.on 'value', (f = ->)
    expect(p).toBeActive()
    mapped.off 'value', f
    expect(p).toNotBeActive()

  it 'should handle all values and errors', ->
    p = prop(1, 'a')
    state = watch(p.map(x2))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[2,4,6],errors:['a','b','c']})
