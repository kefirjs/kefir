Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers


describe '.flatMapLatest()', ->

  it 'should activate/deactivate source property', ->
    p = prop()
    mapped = p.flatMapLatest()
    expect(p).toNotBeActive()
    mapped.on 'value', (f = ->)
    expect(p).toBeActive()
    mapped.off 'value', f
    expect(p).toNotBeActive()

  it 'if has no sub-sources should end when source ends', ->
    p = prop()
    mapped = activate(p.flatMapLatest())
    expect(mapped).toNotBeEnded()
    send(p, 'end')
    expect(mapped).toBeEnded()

  it 'if sorce ended should end when latest sub-source ends', ->
    p = prop()
    mapped = activate(p.flatMapLatest())
    send(p, 'value', (subP1 = prop()))
    send(p, 'value', (subP2 = prop()))
    send(p, 'end')
    expect(mapped).toNotBeEnded()
    send(subP2, 'end')
    expect(mapped).toBeEnded()

  it 'if orig property has current *value*, and it is property that in turn has current *value*, that current *value* should became current *value* of result property', ->
    expect(  activate(prop(prop(1)).flatMapLatest())  ).toHasValue(1)

  it 'if orig property has current *value* (another prop with current) and *end*', ->
    p = activate(prop(prop(1, null, 3), null, 2).flatMapLatest())
    expect(p).toHasValue(1)
    expect(p).toBeEnded()

  it 'if orig property has current *error*, and it is property that in turn has current *error*, that current *error* should became current *error* of result property', ->
    expect(  activate(prop(prop(null, 1)).flatMapLatest())  ).toHasError(1)

  it 'should handle current *error*', ->
    expect(  activate(prop(null, 1).flatMapLatest())  ).toHasError(1)

  it 'should pass further errors from source', ->
    p = prop()
    state = watch(p.flatMapLatest())
    send(p, 'error', 'b')
    send(p, 'error', 'c')
    expect(state).toEqual({values:[],errors:['b','c']})

  it 'should pass all values/errors from only latest sub sources', ->
    p = prop()
    state = watch(p.flatMapLatest())
    send(p, 'value', (p1 = prop()))
    send(p1, 'value', 1)
    send(p1, 'error', 'e1')
    expect(state).toEqual({values:[1],errors:['e1']})
    send(p, 'value', (p2 = prop()))
    send(p1, 'value', 2)
    send(p1, 'error', 'e2')
    expect(state).toEqual({values:[1],errors:['e1']})
    send(p2, 'value', 3)
    send(p2, 'error', 'e3')
    expect(state).toEqual({values:[1,3],errors:['e1','e3']})

  it 'allows to pass optional mapFn', ->
    p = prop({prop: prop(0, 'e0')})
    state = watch(p.flatMapLatest((x) -> x.prop))
    send(p, 'value', {prop: (p1 = prop())})
    send(p1, 'value', 1)
    send(p1, 'error', 'e1')
    expect(state).toEqual({values:[0,1],errors:['e0','e1']})
    send(p, 'value', {prop: (p2 = prop())})
    send(p1, 'value', 2)
    send(p1, 'error', 'e2')
    expect(state).toEqual({values:[0,1],errors:['e0','e1']})
    send(p2, 'value', 3)
    send(p2, 'error', 'e3')
    expect(state).toEqual({values:[0,1,3],errors:['e0','e1','e3']})


