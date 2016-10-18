{stream, send} = require('../test-helpers.coffee')

describe 'spy', ->

  describe 'adding', ->
    it 'should return the stream', ->
      expect(stream().spy()).toBeStream()

    it 'should not activate the stream', ->
       a = stream().spy()
       expect(a).not.toBeActive()

  describe 'removing', ->
    it 'should return the stream', ->
      expect(stream().spy().offSpy()).toBeStream()

    it 'should not activate the stream', ->
       a = stream().spy().offSpy()
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

    it 'should not log if the spy has been removed', ->
      a = stream()
      a.spy()
      a.offSpy()
      expect(a).toEmit [1, 2, 3], ->
        send(a, [1, 2, 3])
        expect(console.log).not.toHaveBeenCalled()

    afterEach ->
      console.log = _log
