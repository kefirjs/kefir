{stream, send} = require('../test-helpers.coffee')

describe 'log', ->

  describe 'adding', ->

    it 'should return the stream', ->
      expect(stream().log()).toBeStream()

    it 'should activate the stream', ->
       a = stream().log()
       expect(a).toBeActive()

  describe 'removing', ->

    it 'should return the stream', ->
      expect(stream().log().offLog()).toBeStream()

    it 'should deactivate the stream', ->
       a = stream().log().offLog()
       expect(a).not.toBeActive()

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

    it 'should not log if the log has been removed', ->
      a = stream()
      a.log()
      a.offLog()
      expect(a).toEmit [1, 2, 3], ->
        send(a, [1, 2, 3])
        expect(console.log).not.toHaveBeenCalled()

    afterEach ->
      console.log = _log
