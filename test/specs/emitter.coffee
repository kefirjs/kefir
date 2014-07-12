Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers

describe '.emitter()', ->

  it 'should return not ended property without any value or error', ->
    p = Kefir.emitter()
    expect(p).toNotBeEnded()
    expect(p).toHasNoValue()
    expect(p).toHasNoError()

  it 'when an *value* emitted it should became current *value*', ->
    p = Kefir.emitter()
    p.emit('value', 1)
    expect(p).toHasValue(1)

  it 'when an *error* emitted it should became current *error*', ->
    p = Kefir.emitter()
    p.emit('error', 1)
    expect(p).toHasError(1)

  it 'should end when *end* emitted', ->
    p = Kefir.emitter()
    p.emit('end')
    expect(p).toBeEnded()

  it 'should pass all emitted values/errors', ->
    p = Kefir.emitter()
    state = watch p
    p.emit('value', 1)
    p.emit('error', 'e1')
    p.emit('value', 2)
    p.emit('error', 'e2')
    expect(state).toEqual({values:[1,2],errors:['e1','e2']})
