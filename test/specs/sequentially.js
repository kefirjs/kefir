Kefir = require('../../dist/kefir')

describe 'sequentially', ->

  it 'should return stream', ->
    expect(Kefir.sequentially(100, [1, 2, 3])).toBeStream()

  it 'should be ended if empty array provided', ->
    expect(Kefir.sequentially(100, [])).toEmitInTime [[0, '<end:current>']]

  it 'should emmit values at certain time then end', ->
    expect(Kefir.sequentially(100, [1, 2, 3])).toEmitInTime [[ 100, 1 ], [ 200, 2 ], [ 300, 3 ], [ 300, '<end>' ]]
