Kefir = require('kefir')

describe 'fromPoll', ->

  it 'should return stream', ->
    expect(Kefir.fromPoll(100, ->)).toBeStream()

  it 'should emit whatever fn returns at certain time', ->
    i = 0
    expect(Kefir.fromPoll(100, -> ++i)).toEmitInTime [[ 100, 1 ], [ 200, 2 ], [ 300, 3 ]], null, 350
