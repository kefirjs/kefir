Kefir = require('kefir')
helpers = require('../test-helpers.coffee')



describe 'Kefir.constant()', ->

  it 'should return a ended property with provided value', ->
    expect(Kefir.constant(1)).toBeEnded()
    expect(Kefir.constant(1)).toHasValue(1)
    expect(Kefir.constant(1)).toHasNoError()




describe 'Kefir.constantError()', ->

  it 'should return a ended property with provided error', ->
    expect(Kefir.constantError(1)).toBeEnded()
    expect(Kefir.constantError(1)).toHasNoValue()
    expect(Kefir.constantError(1)).toHasError(1)





describe 'Kefir.empty()', ->

  it 'should return a ended property without value or error', ->
    expect(Kefir.empty()).toBeEnded()
    expect(Kefir.empty()).toHasNoValue()
    expect(Kefir.empty()).toHasNoError()
