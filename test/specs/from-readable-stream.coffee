EventEmitter = require('events')
{Kefir, activate, deactivate} = require('../test-helpers.coffee')


describe 'fromReadableStream', ->
  it 'should emit data values', ->
    readableStream = new EventEmitter()
    expect(
      Kefir.fromReadableStream(readableStream)
    ).toEmit [1], ->
      readableStream.emit('data', 1)

  it 'should emit errors', ->
    readableStream = new EventEmitter()
    expect(
      Kefir.fromReadableStream(readableStream)
    ).toEmit [{error: -1}], ->
      readableStream.emit('error', -1)

  it 'should end with stream', ->
    readableStream = new EventEmitter()
    expect(
      Kefir.fromReadableStream(readableStream)
    ).toEmit ['<end>'], ->
      readableStream.emit('end')

  it 'should remove listeners to avoid duplicate events', ->
    readableStream = new EventEmitter()
    s = Kefir.fromReadableStream(readableStream)
    activate(s)
    deactivate(s)
    activate(s)
    deactivate(s)
    expect(s).toEmit [1, '<end>'], ->
      readableStream.emit('data', 1)
      readableStream.emit('end')
