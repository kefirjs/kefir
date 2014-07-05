Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.removeCurrent()', ->

  it 'should end when source ends', ->
    p = prop()
    removed = p.removeCurrent()
    expect(removed).toNotBeEnded()
    send(p, 'end')
    expect(removed).toBeEnded()



  it 'should not pass initial *value* (by default)', ->
    expect(  prop(1).removeCurrent()  ).toHasNoValue()

  it 'should not pass initial *value* (with `both`)', ->
    expect(  prop(1).removeCurrent('both')  ).toHasNoValue()

  it 'should not pass initial *value* (with `value`)', ->
    expect(  prop(1).removeCurrent('value')  ).toHasNoValue()

  it 'should DO pass initial *value* (with `error`)', ->
    expect(  prop(1).removeCurrent('error')  ).toHasValue(1)



  it 'should not pass initial *error* (by default)', ->
    expect(  prop(null, 1).removeCurrent()  ).toHasNoError()

  it 'should not pass initial *error* (with `both`)', ->
    expect(  prop(null, 1).removeCurrent('both')  ).toHasNoError()

  it 'should not pass initial *error* (with `error`)', ->
    expect(  prop(null, 1).removeCurrent('error')  ).toHasNoError()

  it 'should DO pass initial *error* (with `value`)', ->
    expect(  prop(null, 1).removeCurrent('value')  ).toHasError(1)




  it 'should activate/deactivate source property', ->
    p = prop()
    removed = p.removeCurrent()
    expect(p).toNotBeActive()
    removed.on 'value', (f = ->)
    expect(p).toBeActive()
    removed.off 'value', f
    expect(p).toNotBeActive()


  it 'should handle further values and errors', ->
    p = prop(1, 'a')
    state = watch(p.removeCurrent())
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[2,3],errors:['b','c'],ended:false})
