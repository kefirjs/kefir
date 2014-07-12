Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.filter()', ->

  isEven = (x) -> x % 2 == 0

  it 'should end when source ends', ->
    p = prop()
    filtered = activate(p.filter(isEven))
    expect(filtered).toNotBeEnded()
    send(p, 'end')
    expect(filtered).toBeEnded()

  it 'should handle initial *value* (pass filter)', ->
    expect(  activate(prop(2).filter(isEven))  ).toHasValue(2)

  it 'should handle initial *value* (not pass filter)', ->
    expect(  activate(prop(1).filter(isEven))  ).toHasNoValue()

  it 'should handle initial *error*', ->
    expect(  activate(prop(null, 1).filter(isEven))  ).toHasError(1)

  it 'should activate/deactivate source property', ->
    p = prop()
    filtered = p.filter(isEven)
    expect(p).toNotBeActive()
    filtered.on 'value', (f = ->)
    expect(p).toBeActive()
    filtered.off 'value', f
    expect(p).toNotBeActive()

  it 'should handle all values and errors', ->
    p = prop(1, 'a')
    state = watch(p.filter(isEven))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[2],errors:['a','b','c']})
