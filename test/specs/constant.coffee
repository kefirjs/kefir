Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, withFakeTime} = helpers


describe 'Kefir.constant()', ->

  it 'should return a ended property with provided value', ->
    expect(Kefir.constant(1)).toBeEnded()
    expect(Kefir.constant(1)).toHasValue(1)
    expect(Kefir.constant(1)).toHasNoError()
