Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, withFakeTime} = helpers


describe 'Kefir.empty()', ->

  it 'should return a ended property without value or error', ->
    expect(Kefir.empty()).toBeEnded()
    expect(Kefir.empty()).toHasNoValue()
    expect(Kefir.empty()).toHasNoError()
