Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, withFakeTime} = helpers


describe 'Kefir.constantError()', ->

  it 'should return a ended property with provided error', ->
    expect(Kefir.constantError(1)).toBeEnded()
    expect(Kefir.constantError(1)).toHasNoValue()
    expect(Kefir.constantError(1)).toHasError(1)
