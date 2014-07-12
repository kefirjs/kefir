Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.addCurrent()', ->

  it 'should end when source ends', ->
    p = prop()
    p1 = activate(p.addCurrent('value', 1))
    expect(p1).toNotBeEnded()
    send(p, 'end')
    expect(p1).toBeEnded()

  it 'should has specified current *value*', ->
    expect(  activate(prop().addCurrent('value', 1))  ).toHasValue(1)

  it 'should has specified current *value* (already has another)', ->
    expect(  activate(prop(0).addCurrent('value', 1))  ).toHasValue(1)

  it 'should has specified current *error*', ->
    expect(  activate(prop().addCurrent('error', 1))  ).toHasError(1)

  it 'should has specified current *error* (already has another)', ->
    expect(  activate(prop(null, 0).addCurrent('error', 1))  ).toHasError(1)

  it 'should pass initial *value* when called with `error`', ->
    expect(  activate(prop(0).addCurrent('error', 1))  ).toHasValue(0)

  it 'should pass initial *error* when called with `value`', ->
    expect(  activate(prop(null, 0).addCurrent('value', 1))  ).toHasError(0)


  it 'should activate/deactivate source property', ->
    p = prop()
    p1 = p.addCurrent('value', 1)
    expect(p).toNotBeActive()
    p1.on 'value', (f = ->)
    expect(p).toBeActive()
    p1.off 'value', f
    expect(p).toNotBeActive()


  it 'should handle further values and errors', ->
    p = prop(1, 'a')
    state = watch(p.addCurrent('value', 0))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    expect(state).toEqual({values:[0,2,3],errors:['a','b','c']})


  it 'should has specified current *value* after reactivation', ->
    p = prop()
    p1 = p.addCurrent('value', 1)
    p1.on 'value', (f = ->)
    expect(p1).toHasValue(1)
    send(p, 'value', 2)
    expect(p1).toHasValue(2)
    p1.off 'value', f
    p1.on 'value', f
    expect(p1).toHasValue(1)

