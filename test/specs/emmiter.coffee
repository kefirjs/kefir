Kefir = require('../../dist/kefir')

describe 'emitter', ->

  it 'should return stream', ->
    expect(Kefir.emitter()).toBeStream()
    expect(new Kefir.Emitter()).toBeStream()

  it 'should return emitter', ->
    expect(Kefir.emitter()).toBeEmitter()
    expect(new Kefir.Emitter()).toBeEmitter()

  it 'should not be ended', ->
    expect(Kefir.emitter()).toEmit []

  it 'should emit events', ->
    a = Kefir.emitter()
    expect(a).toEmit [1, 2, {error: -1}, 3, '<end>'], ->
      a.emit(1)
      a.emit(2)
      a.error(-1)
      a.emit(3)
      a.end()

  it 'should emit events via .emitEvent', ->
    a = Kefir.emitter()
    expect(a).toEmit [1, 2, {error: -1}, 3, '<end>'], ->
      a.emitEvent({type: 'value', value: 1, current: false})
      a.emitEvent({type: 'value', value: 2, current: true}) # `current` should be ignored
      a.emitEvent({type: 'error', value: -1, current: false})
      a.emitEvent({type: 'value', value: 3, current: false})
      a.emitEvent({type: 'end', value: undefined, current: false})
