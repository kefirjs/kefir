Kefir = require('../../dist/kefir')

describe 'later', ->

  it 'should return stream', ->
    expect(Kefir.later(100, 1)).toBeStream()

  it 'should emmit value after interval then end', ->
    expect(Kefir.later(100, 1)).toEmitInTime [[100, 1], [100, '<end>']]
