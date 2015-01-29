Kefir = require('../../dist/kefir')

describe 'constant', ->

  it 'should return property', ->
    expect(Kefir.constant(1)).toBeProperty()

  it 'should be ended and has current', ->
    expect(Kefir.constant(1)).toEmit [{current: 1}, '<end:current>']
