Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.skipCurrent()', ->

  it 'should end when source ends', ->
    p = prop()
    removed = activate(p.skipCurrent())
    expect(removed).toNotBeEnded()
    send(p, 'end')
    expect(removed).toBeEnded()



  it 'should not pass current *value* (by default)', ->
    expect(  activate(prop(1).skipCurrent())  ).toHasNoValue()

  it 'should not pass current *value* (with `value`)', ->
    expect(  activate(prop(1).skipCurrent('value'))  ).toHasNoValue()

  it 'should DO pass current *value* (with `error`)', ->
    expect(  activate(prop(1).skipCurrent('error'))  ).toHasValue(1)



  it 'should not pass current *error* (by default)', ->
    expect(  activate(prop(null, 1).skipCurrent())  ).toHasNoError()

  it 'should not pass current *error* (with `error`)', ->
    expect(  activate(prop(null, 1).skipCurrent('error'))  ).toHasNoError()

  it 'should DO pass current *error* (with `value`)', ->
    expect(  activate(prop(null, 1).skipCurrent('value'))  ).toHasError(1)




  it 'should activate/deactivate source property', ->
    p = prop()
    removed = p.skipCurrent()
    expect(p).toNotBeActive()
    removed.on 'value', (f = ->)
    expect(p).toBeActive()
    removed.off 'value', f
    expect(p).toNotBeActive()


  it 'should handle further values and errors', ->
    p = prop(1, 'a')
    state = watch(p.skipCurrent())
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[2,3],errors:['b','c']})
