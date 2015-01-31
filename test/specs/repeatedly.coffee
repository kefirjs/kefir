Kefir = require('../../dist/kefir')

describe 'repeatedly', ->

  it 'should return stream', ->
    expect(Kefir.repeatedly(100, [1, 2, 3])).toBeStream()

  it 'should emmit nothing if empty array provided', ->
    expect(Kefir.repeatedly(100, [])).toEmitInTime([], null, 750)

  it 'should repeat values from array at certain time', ->
    expect(Kefir.repeatedly(100, [1, 2, 3])).toEmitInTime(
      [[ 100, 1 ], [ 200, 2 ], [ 300, 3 ], [ 400, 1 ], [ 500, 2 ], [ 600, 3 ], [ 700, 1 ]],
      null,
      750
    )
