Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{prop, send, activate} = helpers


describe 'Property', ->

  describe 'new', ->

    it 'should create a Property', ->
      expect(prop()).toBeProperty()
      expect(new Kefir.Property()).toBeProperty()

    it 'should not be ended', ->
      expect(prop()).toEmit []

    it 'should not be active', ->
      expect(prop()).not.toBeActive()


  describe 'end', ->

    it 'should end when `end` sent', ->
      s = prop()
      expect(s).toEmit ['<end>'], ->
        send(s, ['<end>'])

    it 'should call `end` subscribers', ->
      s = prop()
      log = []
      s.onEnd -> log.push(1)
      s.onEnd -> log.push(2)
      expect(log).toEqual([])
      send(s, ['<end>'])
      expect(log).toEqual([1, 2])

    it 'should call `end` subscribers on already ended property', ->
      s = prop()
      send(s, ['<end>'])
      log = []
      s.onEnd -> log.push(1)
      s.onEnd -> log.push(2)
      expect(log).toEqual([1, 2])

    it 'should deactivate on end', ->
      s = prop()
      activate(s)
      expect(s).toBeActive()
      send(s, ['<end>'])
      expect(s).not.toBeActive()

    it 'should stop deliver new values after end', ->
      s = prop()
      expect(s).toEmit [1, 2, '<end>'], -> send(s, [1, 2, '<end>', 3])


  describe 'active state', ->

    it 'should activate when first subscriber added (value)', ->
      s = prop()
      s.onValue ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (end)', ->
      s = prop()
      s.onEnd ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (any)', ->
      s = prop()
      s.onAny ->
      expect(s).toBeActive()

    it 'should deactivate when all subscribers removed', ->
      s = prop()
      s.onAny (any1 = ->)
      s.onAny (any2 = ->)
      s.onValue (value1 = ->)
      s.onValue (value2 = ->)
      s.onEnd (end1 = ->)
      s.onEnd (end2 = ->)
      s.offValue value1
      s.offValue value2
      s.offAny any1
      s.offAny any2
      s.offEnd end1
      expect(s).toBeActive()
      s.offEnd end2
      expect(s).not.toBeActive()


  describe 'subscribers', ->

    it 'should deliver values and current', ->
      s = send(prop(), [0])
      expect(s).toEmit [{current: 0}, 1, 2], -> send(s, [1, 2])

    it 'onValue subscribers should be called with 1 argument', ->
      s = send(prop(), [0])
      count = null
      s.onValue -> count = arguments.length
      expect(count).toBe(1)
      send(s, [1])
      expect(count).toBe(1)

    it 'onAny subscribers should be called with 3 arguments', ->
      s = send(prop(), [0])
      count = null
      s.onAny -> count = arguments.length
      expect(count).toBe(3)
      send(s, [1])
      expect(count).toBe(3)


    it 'onEnd subscribers should be called with 0 arguments', ->
      s = send(prop(), [0])
      count = null
      s.onEnd -> count = arguments.length
      send(s, ['<end>'])
      expect(count).toBe(0)
      s.onEnd -> count = arguments.length
      expect(count).toBe(0)
