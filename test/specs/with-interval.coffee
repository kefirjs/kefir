Kefir = require('kefir')

describe 'withInterval', ->

  it 'should return stream', ->
    expect(Kefir.withInterval(100, ->)).toBeStream()

  it 'should work as expected', ->
    i = 0
    fn = (send) ->
      i++
      send('value', i)
      send('value', i*2)
      if i == 3
        send('end')
    expect(Kefir.withInterval(100, fn)).toEmitInTime(
      [[ 100, 1 ], [ 100, 2 ], [ 200, 2 ], [ 200, 4 ], [ 300, 3 ], [ 300, 6 ], [ 300, '<end>' ]]
    )
