Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers

describe '.combine()', ->

  it 'if passed empty array should return ended property without value or error', ->
    p = Kefir.combine([])
    expect(p).toBeEnded()
    expect(p).toHasNoValue()
    expect(p).toHasNoError()

  it 'should end when all sources ends', ->
    p1 = prop()
    p2 = prop()
    mp = Kefir.combine([p1, p2])
    expect(mp).toNotBeEnded()
    send(p1, 'end')
    expect(mp).toNotBeEnded()
    send(p2, 'end')
    expect(mp).toBeEnded()

  it 'should pass initial values', ->
    expect( Kefir.combine([prop(1)]) ).toHasEqualValue([1])

  it 'if multiple properties has initial should pass them all', ->
    expect( Kefir.combine([prop(1), prop(2)]) ).toHasEqualValue([1, 2])

  it 'if only some of multiple properties has initial should NOT pass', ->
    expect( Kefir.combine([prop(1), prop()]) ).toHasNoValue()

  it 'should pass initial errors', ->
    expect( Kefir.combine([prop(null, 1)]) ).toHasError(1)

  it 'if multiple properties has initial error should pass error from latest', ->
    expect( Kefir.combine([prop(null, 1), prop(null, 2)]) ).toHasError(2)

  it 'should pass further errors from all properties', ->
    p1 = prop()
    p2 = prop()
    state = watch Kefir.combine([p1, p2])
    expect(state).toEqual({values:[],errors:[],ended:false})
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    expect(state).toEqual({values:[],errors:['e1','e2'],ended:false})

  it 'should handle further values from all properties', ->
    p1 = prop()
    p2 = prop()
    state = watch Kefir.combine([p1, p2])
    expect(state).toEqual({values:[],errors:[],ended:false})
    send(p1, 'value', 1)
    expect(state).toEqual({values:[],errors:[],ended:false})
    send(p2, 'value', 2)
    expect(state).toEqual({values:[[1,2]],errors:[],ended:false})
    send(p1, 'value', 3)
    expect(state).toEqual({values:[[1,2],[3,2]],errors:[],ended:false})


  it 'allows to pass optional combimator', ->
    p1 = prop(1)
    p2 = prop(2)
    state = watch Kefir.combine([p1, p2], (a,b) -> a+b)
    expect(state).toEqual({values:[3],errors:[],ended:false})
    send(p1, 'value', 3)
    send(p2, 'value', 4)
    expect(state).toEqual({values:[3,5,7],errors:[],ended:false})

  it '`property.combine(other, f)` should work', ->
    p1 = prop(1)
    p2 = prop(2)
    state = watch p1.combine(p2, (a,b) -> a+b)
    expect(state).toEqual({values:[3],errors:[],ended:false})
    send(p1, 'value', 3)
    send(p2, 'value', 4)
    expect(state).toEqual({values:[3,5,7],errors:[],ended:false})
