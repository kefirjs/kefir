Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers

describe '.sampledBy()', ->

  it 'if passed empty array of samlers should return ended property without value or error', ->
    p = activate(Kefir.sampledBy([prop()], []))
    expect(p).toBeEnded()
    expect(p).toHasNoValue()
    expect(p).toHasNoError()

  it 'should end when all samlers ends', ->
    p1 = prop()
    p2 = prop()
    mp = activate(Kefir.sampledBy([prop()], [p1, p2]))
    expect(mp).toNotBeEnded()
    send(p1, 'end')
    expect(mp).toNotBeEnded()
    send(p2, 'end')
    expect(mp).toBeEnded()

  it 'should pass current values (0 sources, 1 sampler)', ->
    expect(
      activate(Kefir.sampledBy([], [prop(1)]))
    ).toHasEqualValue([1])

  it 'should pass current values (1 source, 1 sampler)', ->
    expect(
      activate(Kefir.sampledBy([prop(0)], [prop(1)]))
    ).toHasEqualValue([0, 1])

  it 'should pass current values (2 sources, 2 sampler)', ->
    expect(
      activate(Kefir.sampledBy([prop(0), prop(1)], [prop(2), prop(3)]))
    ).toHasEqualValue([0, 1, 2, 3])

  it 'if only some of multiple properties has current should NOT pass', ->
    expect(
      activate(Kefir.sampledBy([prop(1), prop()], [prop(2), prop(3)]))
    ).toHasNoValue()

  it 'should pass current errors (1 source, 0 samlers)', ->
    expect(
      activate(Kefir.sampledBy([prop(null, 1)], []))
    ).toHasError(1)

  it 'should pass current errors (0 sources, 1 samler)', ->
    expect(
      activate(Kefir.sampledBy([], [prop(null, 1)]))
    ).toHasError(1)

  it 'should pass current errors (1 source, 1 sampler)', ->
    expect(
      activate(Kefir.sampledBy([prop(null, 0)], [prop(null, 1)]))
    ).toHasError(1)

  it 'should pass current errors (2 sources, 0 sampler)', ->
    expect(
      activate(Kefir.sampledBy([prop(null, 0), prop(null, 1)], []))
    ).toHasError(1)

  it 'should pass current errors (0 sources, 2 sampler)', ->
    expect(
      activate(Kefir.sampledBy([], [prop(null, 0), prop(null, 1)]))
    ).toHasError(1)

  it 'should pass current errors (2 sources, 2 sampler)', ->
    expect(
      activate(Kefir.sampledBy([prop(null, 0), prop(null, 1)], [prop(null, 2), prop(null, 3)]))
    ).toHasError(3)

  it 'should pass further errors from all properties', ->
    p1 = prop()
    p2 = prop()
    state = watch Kefir.sampledBy([p1], [p2])
    expect(state).toEqual({values:[],errors:[]})
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    expect(state).toEqual({values:[],errors:['e1','e2']})

  it 'should handle further values from all properties', ->
    p1 = prop()
    p2 = prop()
    state = watch Kefir.sampledBy([p1], [p2])
    expect(state).toEqual({values:[],errors:[]})
    send(p1, 'value', 1)
    expect(state).toEqual({values:[],errors:[]})
    send(p2, 'value', 2)
    expect(state).toEqual({values:[[1,2]],errors:[]})
    send(p1, 'value', 3)
    expect(state).toEqual({values:[[1,2]],errors:[]})
    send(p2, 'value', 4)
    expect(state).toEqual({values:[[1,2],[3,4]],errors:[]})

  it 'should activate/deactivate sources', ->
    p1 = prop()
    p2 = prop()
    sampled = Kefir.sampledBy([p1, p2], [prop()])
    expect(p1).toNotBeActive()
    expect(p2).toNotBeActive()
    sampled.on 'value', (f = ->)
    expect(p1).toBeActive()
    expect(p2).toBeActive()
    sampled.off 'value', f
    expect(p1).toNotBeActive()
    expect(p2).toNotBeActive()

  it 'should activate/deactivate samplers', ->
    p1 = prop()
    p2 = prop()
    sampled = Kefir.sampledBy([prop()], [p1, p2])
    expect(p1).toNotBeActive()
    expect(p2).toNotBeActive()
    sampled.on 'value', (f = ->)
    expect(p1).toBeActive()
    expect(p2).toBeActive()
    sampled.off 'value', f
    expect(p1).toNotBeActive()
    expect(p2).toNotBeActive()

  it 'allows to pass optional combimator', ->
    p1 = prop(1)
    p2 = prop(2)
    state = watch Kefir.sampledBy([p1], [p2], (a,b) -> a+b)
    expect(state).toEqual({values:[3],errors:[]})
    send(p1, 'value', 3)
    send(p2, 'value', 4)
    expect(state).toEqual({values:[3,7],errors:[]})

  it '`property.sampledBy(other, f)` should work', ->
    p1 = prop(1)
    p2 = prop(2)
    state = watch p1.sampledBy(p2, (a,b) -> a+b)
    expect(state).toEqual({values:[3],errors:[]})
    send(p1, 'value', 3)
    send(p2, 'value', 4)
    expect(state).toEqual({values:[3,7],errors:[]})

  it '`property.sampledBy(other)` should work', ->
    p1 = prop(1)
    p2 = prop(2)
    state = watch p1.sampledBy(p2)
    expect(state).toEqual({values:[1],errors:[]})
    send(p1, 'value', 3)
    send(p2, 'value', 4)
    expect(state).toEqual({values:[1,3],errors:[]})
