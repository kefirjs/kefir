Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.flatMap()', ->

  it 'should activate/deactivate source property', ->
    p = prop()
    flatMapped = p.flatMap()
    expect(p).toNotBeActive()
    flatMapped.on 'value', (f = ->)
    expect(p).toBeActive()
    flatMapped.off 'value', f
    expect(p).toNotBeActive()

  it 'if has no sub-sources should end when source ends', ->
    p = prop()
    flatMapped = p.flatMap()
    expect(flatMapped).toNotBeEnded()
    send(p, 'end')
    expect(flatMapped).toBeEnded()

  it 'if original property was ended should produce ended property', ->
    expect(  send(prop(), 'end').flatMap()  ).toBeEnded()

  it 'if sorce ended should end when all sub-sources ends', ->
    p = prop()
    flatMapped = p.flatMap()
    flatMapped.on('value', ->) # in order to sub sources to be added prop should be active
    send(p, 'value', (subP1 = prop()))
    send(p, 'value', (subP2 = prop()))
    send(p, 'end')
    expect(flatMapped).toNotBeEnded()
    send(subP2, 'end')
    expect(flatMapped).toNotBeEnded()
    send(subP1, 'end')
    expect(flatMapped).toBeEnded()

  it 'if orig property has current *value*, and it is property that in turn has current *value*, that current *value* should became current *value* of result property', ->
    expect(  prop(prop(1)).flatMap()  ).toHasValue(1)

  it 'if orig property has current *error*, and it is property that in turn has current *error*, that current *error* should became current *error* of result property', ->
    expect(  prop(prop(null, 1)).flatMap()  ).toHasError(1)

  it 'should handle initial *error*', ->
    expect(  prop(null, 1).flatMap()  ).toHasError(1)

  it 'should pass further errors from source', ->
    p = prop()
    state = watch(p.flatMap())
    send(p, 'error', 'b')
    send(p, 'error', 'c')
    expect(state).toEqual({values:[],errors:['b','c'],ended:false})

  it 'should pass all values/errors from sub sources', ->
    p = prop()
    state = watch(p.flatMap())
    send(p, 'value', (p1 = prop()))
    send(p, 'value', (p2 = prop()))
    send(p1, 'value', 1)
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    send(p2, 'value', 2)
    expect(state).toEqual({values:[1,2],errors:['e1','e2'],ended:false})

  it 'allows to pass optional mapFn', ->
    p = prop({prop: prop(0, 'e0')})
    state = watch(p.flatMap((x) -> x.prop))
    send(p, 'value', {prop: (p1 = prop())})
    send(p, 'value', {prop: (p2 = prop())})
    send(p1, 'value', 1)
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    send(p2, 'value', 2)
    expect(state).toEqual({values:[0,1,2],errors:['e0','e1','e2'],ended:false})
