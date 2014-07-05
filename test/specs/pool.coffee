Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers

describe '.pool()', ->

  it 'should return not ended property without any value or error', ->
    p = Kefir.pool()
    expect(p).toNotBeEnded()
    expect(p).toHasNoValue()
    expect(p).toHasNoError()

  it 'when an property with current *value* added that current *value* should bacame current *value* of pool', ->
    p = Kefir.pool()
    p.add(prop(1))
    expect(p).toHasValue(1)

  it 'when an property with current *value* added that current *value* should bacame current *value* of pool (ended)', ->
    p = Kefir.pool()
    p.add(send(prop(1), 'end'))
    expect(p).toHasValue(1)

  it 'when an property with current *error* added that current *error* should bacame current *error* of pool', ->
    p = Kefir.pool()
    p.add(prop(null, 1))
    expect(p).toHasError(1)

  it 'when an property with current *error* added that current *error* should bacame current *error* of pool (ended)', ->
    p = Kefir.pool()
    p.add(send(prop(null, 1), 'end'))
    expect(p).toHasError(1)

  it 'should not end when source ends', ->
    p = Kefir.pool()
    s = prop()
    p.add(s)
    send(s, 'end')
    expect(p).toNotBeEnded()

  it 'should pass all values/errors', ->
    pool = Kefir.pool()
    state = watch pool
    pool.add(p1 = prop(1))
    pool.add(p2 = prop(2))
    send(p1, 'value', 3)
    send(p2, 'error', 'e1')
    send(p1, 'error', 'e2')
    send(p2, 'value', 4)
    expect(state).toEqual({values:[1,2,3,4],errors:['e1','e2'],ended:false})

  it 'should not pass values/errors from removed properties', ->
    pool = Kefir.pool()
    state = watch pool
    pool.add(p1 = prop(1))
    pool.add(p2 = prop(2))
    send(p1, 'value', 3)
    send(p2, 'error', 'e1')
    pool.remove(p1)
    pool.remove(p2)
    send(p1, 'error', 'e2')
    send(p2, 'value', 4)
    expect(state).toEqual({values:[1,2,3],errors:['e1'],ended:false})
