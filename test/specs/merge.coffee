Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers

describe '.merge()', ->

  it 'if passed empty array should return ended property without value or error', ->
    p = Kefir.merge([])
    expect(p).toBeEnded()
    expect(p).toHasNoValue()
    expect(p).toHasNoError()

  it 'if passed array with all ended properties should return ended property without value or error', ->
    p = Kefir.merge([send(prop(), 'end'), send(prop(), 'end')])
    expect(p).toBeEnded()
    expect(p).toHasNoValue()
    expect(p).toHasNoError()

  it 'should end when all sources ends', ->
    p1 = prop()
    p2 = prop()
    mp = Kefir.merge([p1, p2])
    expect(mp).toNotBeEnded()
    send(p1, 'end')
    expect(mp).toNotBeEnded()
    send(p2, 'end')
    expect(mp).toBeEnded()

  it 'should pass initial values', ->
    expect( Kefir.merge([prop(1)]) ).toHasValue(1)

  it 'if multiple properties has initial should pass value from latest', ->
    expect( Kefir.merge([prop(1), prop(2)]) ).toHasValue(2)

  it 'should pass initial errors', ->
    expect( Kefir.merge([prop(null, 1)]) ).toHasError(1)

  it 'if multiple properties has initial should pass error from latest', ->
    expect( Kefir.merge([prop(null, 1), prop(null, 2)]) ).toHasError(2)

  it 'should pass further values and errors from all properties', ->
    p1 = prop()
    p2 = prop()
    state = watch Kefir.merge([p1, p2])
    expect(state).toEqual({values:[],errors:[],ended:false})
    send(p1, 'value', 1)
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    send(p2, 'value', 2)
    expect(state).toEqual({values:[1,2],errors:['e1','e2'],ended:false})

  it 'allows to not wrap sources to array', ->
    p1 = prop(0)
    p2 = prop(null, 'e0')
    state = watch Kefir.merge(p1, p2)
    expect(state).toEqual({values:[0],errors:['e0'],ended:false})
    send(p1, 'value', 1)
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    send(p2, 'value', 2)
    expect(state).toEqual({values:[0,1,2],errors:['e0','e1','e2'],ended:false})

  it 'should activate/deactivate underlying properties', ->
    p1 = prop()
    p2 = prop()
    merged = Kefir.merge(p1, p2)
    expect(p1).toNotBeActive()
    expect(p2).toNotBeActive()
    merged.on 'value', (f = ->)
    expect(p1).toBeActive()
    expect(p2).toBeActive()
    merged.off 'value', f
    expect(p1).toNotBeActive()
    expect(p2).toNotBeActive()

  it '`property.merge(other)` should work', ->
    p1 = prop(0)
    p2 = prop(null, 'e0')
    state = watch p1.merge(p2)
    expect(state).toEqual({values:[0],errors:['e0'],ended:false})
    send(p1, 'value', 1)
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    send(p2, 'value', 2)
    expect(state).toEqual({values:[0,1,2],errors:['e0','e1','e2'],ended:false})



