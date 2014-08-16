Kefir = require('kefir')

describe 'never', ->

  it 'should return stream', ->
    expect(Kefir.never()).toBeStream()

  it 'should be ended', ->
    expect(Kefir.never()).toEmit ['<end:current>']
