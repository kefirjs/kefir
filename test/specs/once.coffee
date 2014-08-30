Kefir = require('kefir')
{stream, prop, send} = require('../test-helpers.coffee')


describe 'once', ->

  it 'should return stream', ->
    expect(Kefir.once(1)).toBeStream()

  it 'should emit value to first subscriber', ->
    a = Kefir.once(1)
    expect(a).toEmit [1, '<end>']
    expect(a).toEmit ['<end:current>']

  it 'should work fine with flatMap', ->
    a = stream()
    expect(
      a.flatMap (x) -> Kefir.once(x + 1)
    ).toEmit [2, 3, '<end>'], ->
      send(a, [1, 2, '<end>'])
