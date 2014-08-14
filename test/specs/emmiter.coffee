Kefir = require('kefir')

describe 'emitter', ->

  it 'should return stream', ->
    expect(Kefir.emitter()).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.emitter()).toEmit []

  it 'should emit values and end', ->
    a = Kefir.emitter()
    expect(a).toEmit [1, 2, 3, '<end>'], ->
      a.emit(1)
      a.emit(2)
      a.emit(3)
      a.end()
