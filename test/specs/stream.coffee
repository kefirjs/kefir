{stream, send, activate, Kefir} = require('../test-helpers.coffee')



describe 'Stream', ->

  describe 'new', ->

    it 'should create a Stream', ->
      expect(stream()).toBeStream()
      expect(new Kefir.Stream()).toBeStream()

    it 'should not be ended', ->
      expect(stream()).toEmit []

    it 'should not be active', ->
      expect(stream()).not.toBeActive()


  describe 'end', ->

    it 'should end when `end` sent', ->
      s = stream()
      expect(s).toEmit ['<end>'], ->
        send(s, ['<end>'])

    it 'should call `end` subscribers', ->
      s = stream()
      log = []
      s.onEnd -> log.push(1)
      s.onEnd -> log.push(2)
      expect(log).toEqual([])
      send(s, ['<end>'])
      expect(log).toEqual([1, 2])

    it 'should call `end` subscribers on already ended stream', ->
      s = stream()
      send(s, ['<end>'])
      log = []
      s.onEnd -> log.push(1)
      s.onEnd -> log.push(2)
      expect(log).toEqual([1, 2])

    it 'should deactivate on end', ->
      s = stream()
      activate(s)
      expect(s).toBeActive()
      send(s, ['<end>'])
      expect(s).not.toBeActive()

    it 'should stop deliver new values after end', ->
      s = stream()
      expect(s).toEmit [1, 2, '<end>'], -> send(s, [1, 2, '<end>', 3])


  describe 'active state', ->

    it 'should activate when first subscriber added (value)', ->
      s = stream()
      s.onValue ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (error)', ->
      s = stream()
      s.onError ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (end)', ->
      s = stream()
      s.onEnd ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (any)', ->
      s = stream()
      s.onAny ->
      expect(s).toBeActive()

    it 'should deactivate when all subscribers removed', ->
      s = stream()
      s.onAny (any1 = ->)
      s.onAny (any2 = ->)
      s.onValue (value1 = ->)
      s.onValue (value2 = ->)
      s.onError (error1 = ->)
      s.onError (error2 = ->)
      s.onEnd (end1 = ->)
      s.onEnd (end2 = ->)
      s.offValue value1
      s.offValue value2
      s.offError error1
      s.offError error2
      s.offAny any1
      s.offAny any2
      s.offEnd end1
      expect(s).toBeActive()
      s.offEnd end2
      expect(s).not.toBeActive()


  describe 'subscribers', ->

    it 'should deliver values', ->
      s = stream()
      expect(s).toEmit [1, 2], -> send(s, [1, 2])

    it 'should deliver errors', ->
      s = stream()
      expect(s).toEmit [{error: 1}, {error: 2}], -> send(s, [{error: 1}, {error: 2}])

    it 'should not deliver values to unsubscribed subscribers', ->
      log = []
      a = (x) -> log.push('a' + x)
      b = (x) -> log.push('b' + x)
      s = stream()
      s.onValue(a)
      s.onValue(b)
      send(s, [1])
      s.offValue(->)
      send(s, [2])
      s.offValue(a)
      send(s, [3])
      s.offValue(b)
      send(s, [4])
      expect(log).toEqual(['a1', 'b1', 'a2', 'b2', 'b3'])

    it 'should not deliver errors to unsubscribed subscribers', ->
      log = []
      a = (x) -> log.push('a' + x)
      b = (x) -> log.push('b' + x)
      s = stream()
      s.onError(a)
      s.onError(b)
      send(s, [{error: 1}])
      s.offError(->)
      send(s, [{error: 2}])
      s.offError(a)
      send(s, [{error: 3}])
      s.offError(b)
      send(s, [{error: 4}])
      expect(log).toEqual(['a1', 'b1', 'a2', 'b2', 'b3'])

    it 'onValue subscribers should be called with 1 argument', ->
      s = stream()
      count = null
      s.onValue -> count = arguments.length
      send(s, [1])
      expect(count).toBe(1)

    it 'onError subscribers should be called with 1 argument', ->
      s = stream()
      count = null
      s.onError -> count = arguments.length
      send(s, [{error: 1}])
      expect(count).toBe(1)

    it 'onAny subscribers should be called with 1 arguments', ->
      s = stream()
      count = null
      s.onAny -> count = arguments.length
      send(s, [1])
      expect(count).toBe(1)

    it 'onEnd subscribers should be called with 0 arguments', ->
      s = stream()
      count = null
      s.onEnd -> count = arguments.length
      send(s, ['<end>'])
      expect(count).toBe(0)
      s.onEnd -> count = arguments.length
      expect(count).toBe(0)

    it 'should correctly handle unsubscribe during call loop', ->
      s = stream()
      log = []
      a = (x) ->
        log.push('a' + x)
        s.offValue(b)
      b = (x) -> log.push('b' + x)
      s.onValue(a)
      s.onValue(b)
      send(s, [1, 2])
      expect(log).toEqual(['a1', 'b1', 'a2'])


