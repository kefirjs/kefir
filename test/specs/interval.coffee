Kefir = require('kefir')

describe 'interval', ->

  it 'should return stream', ->
    expect(Kefir.interval(100, 1)).toBeStream()

  it 'should repeat same value at certain time', ->
    expect(Kefir.interval(100, 1)).toEmitInTime [[ 100, 1 ], [ 200, 1 ], [ 300, 1 ]], null, 350
