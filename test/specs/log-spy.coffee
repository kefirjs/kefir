{stream, send} = require('../test-helpers.coffee')

describe 'log', ->

  it 'should return the stream', ->
    expect(stream().spy()).toBeStream()

  it 'should activate the stream', ->
     a = stream().log()
     expect(a).toBeActive()

  describe 'console', ->
    _log = undefined

    beforeEach ->
      _log = console.log
      spyOn(console, 'log')

    it 'should have a default name', ->
      a = stream()
      a.log()
      expect(a).toEmit [1, 2, 3], ->
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 2)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 3)

    it 'should use the name', ->
      a = stream()
      a.log('logged')
      expect(a).toEmit [1, 2, 3], ->
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('logged', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('logged', '<value>', 2)
        expect(console.log).toHaveBeenCalledWith('logged', '<value>', 3)

    afterEach ->
      console.log = _log

describe 'spy', ->

  it 'should return the stream', ->
    expect(stream().spy()).toBeStream()

  it 'should not activate the stream', ->
     a = stream().spy()
     expect(a).not.toBeActive()

  describe 'console', ->
    _log = undefined

    beforeEach ->
      _log = console.log
      spyOn(console, 'log')

    it 'should have a default name', ->
      a = stream()
      a.spy()
      expect(a).toEmit [1, 2, 3], ->
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 2)
        expect(console.log).toHaveBeenCalledWith('[stream]', '<value>', 3)

    it 'should use the name', ->
      a = stream()
      a.spy('spied')
      expect(a).toEmit [1, 2, 3], ->
        send(a, [1, 2, 3])
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 1)
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 2)
        expect(console.log).toHaveBeenCalledWith('spied', '<value>', 3)

    afterEach ->
      console.log = _log
