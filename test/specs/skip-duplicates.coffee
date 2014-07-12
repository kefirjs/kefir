Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.skipDuplicates()', ->

  it 'should end when source ends', ->
    p = prop()
    tp = activate(p.skipDuplicates())
    expect(tp).toNotBeEnded()
    send(p, 'end')
    expect(tp).toBeEnded()

  it 'should handle initial *value*', ->
    expect(  activate(prop(1).skipDuplicates())  ).toHasValue(1)

  it 'should handle initial *error*', ->
    expect(  activate(prop(null, 1).skipDuplicates())  ).toHasError(1)

  it 'should handle further *errors* even same', ->
    p = prop()
    state = watch(p.skipDuplicates())
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3,3]})

  it 'should activate/deactivate source property', ->
    p = prop()
    tp = p.skipDuplicates()
    expect(p).toNotBeActive()
    tp.on 'value', (f = ->)
    expect(p).toBeActive()
    tp.off 'value', f
    expect(p).toNotBeActive()

  it 'should skip duplicate values (using === for compare)', ->
    p = prop(1)
    state = watch(p.skipDuplicates())
    send(p, 'value', 1)
    send(p, 'value', 2)
    send(p, 'value', 2)
    send(p, 'value', null)
    send(p, 'value', undefined)
    send(p, 'value', 3)
    expect(state).toEqual({values:[1,2,null,undefined,3],errors:[]})

  it 'should accept optional comparator fn', ->
    p = prop(1)
    state = watch(p.skipDuplicates((a,b)->`a==b`))
    send(p, 'value', 1)
    send(p, 'value', 2)
    send(p, 'value', 2)
    send(p, 'value', null)
    send(p, 'value', undefined)
    send(p, 'value', 3)
    expect(state).toEqual({values:[1,2,null,3],errors:[]})
