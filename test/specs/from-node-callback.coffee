{activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'fromNodeCallback', ->

  it 'should return stream', ->
    expect(Kefir.fromNodeCallback(->)).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.fromNodeCallback(->)).toEmit []

  it 'should call `callbackConsumer` on first activation, and only on first', ->
    count = 0
    s = Kefir.fromNodeCallback -> count++
    expect(count).toBe(0)
    activate(s)
    expect(count).toBe(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    expect(count).toBe(1)

  it 'should emit first result and end after that', ->
    cb = null
    expect(
      Kefir.fromNodeCallback (_cb) -> cb = _cb
    ).toEmit [1, '<end>'], ->
      cb(null, 1)

  it 'should emit first error and end after that', ->
    cb = null
    expect(
      Kefir.fromNodeCallback (_cb) -> cb = _cb
    ).toEmit [{error: -1}, '<end>'], ->
      cb(-1)

  it 'should work after deactivation/activate cicle', ->
    cb = null
    s = Kefir.fromNodeCallback (_cb) -> cb = _cb
    activate(s)
    deactivate(s)
    activate(s)
    deactivate(s)
    expect(s).toEmit [1, '<end>'], ->
      cb(null, 1)

  it 'should emit a current, if `callback` is called immediately in `callbackConsumer`', ->
    expect(
      Kefir.fromNodeCallback (cb) -> cb(null, 1)
    ).toEmit [{current: 1}, '<end:current>']

    expect(
      Kefir.fromNodeCallback (cb) -> cb(-1)
    ).toEmit [{currentError: -1}, '<end:current>']
