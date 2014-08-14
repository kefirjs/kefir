Kefir = require('kefir')

describe 'empty', ->

  it 'should return stream', ->
    expect(Kefir.empty()).toBeStream()

  it 'should be ended', ->
    expect(Kefir.empty()).toEmit ['<end:current>']
