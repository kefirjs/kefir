Kefir = require('kefir')

describe 'withInterval', ->

  it 'should return stream', ->
    expect(Kefir.withInterval(100, ->)).toBeStream()

  it 'should work as expected', ->
    i = 0
    fn = (emitter) ->
      i++
      if i == 2
        emitter.error(-1)
      else
        emitter.emit(i)
        emitter.emit(i*2)
      if i == 3
        emitter.end()
    expect(Kefir.withInterval(100, fn)).toEmitInTime(
      [[ 100, 1 ], [ 100, 2 ], [ 200, {error: -1} ], [ 300, 3 ], [ 300, 6 ], [ 300, '<end>' ]]
    )
