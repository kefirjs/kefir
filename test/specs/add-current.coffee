Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.addCurrent()', ->

  it 'should end when source ends', ->
    p = prop()
    removed = p.addCurrent('value', 1)
    expect(removed).toNotBeEnded()
    send(p, 'end')
    expect(removed).toBeEnded()

  it 'should has specified current *value*', ->
    expect(  prop().addCurrent('value', 1)  ).toHasValue(1)

  it 'should has specified current *value* (already has another)', ->
    expect(  prop(0).addCurrent('value', 1)  ).toHasValue(1)

  it 'should has specified current *error*', ->
    expect(  prop().addCurrent('error', 1)  ).toHasError(1)

  it 'should has specified current *error* (already has another)', ->
    expect(  prop(null, 0).addCurrent('error', 1)  ).toHasError(1)

  it 'should pass initial *value* when called with `error`', ->
    expect(  prop(0).addCurrent('error', 1)  ).toHasValue(0)

  it 'should pass initial *error* when called with `value`', ->
    expect(  prop(null, 0).addCurrent('value', 1)  ).toHasError(0)


  it 'should activate/deactivate source property', ->
    p = prop()
    removed = p.addCurrent('value', 1)
    expect(p).toNotBeActive()
    removed.on 'value', (f = ->)
    expect(p).toBeActive()
    removed.off 'value', f
    expect(p).toNotBeActive()


  it 'should handle further values and errors', ->
    p = prop(1, 'a')
    state = watch(p.addCurrent('value', 0))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[0,2,3],errors:['a','b','c'],ended:false})
