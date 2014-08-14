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
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 1])
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 2])
      expect(log).toEqual([])
      send(s, ['<end>'])
      expect(log).toEqual([[undefined, false, 1], [undefined, false, 2]])

    it 'should call `end` subscribers on already ended property', ->
      s = prop()
      send(s, ['<end>'])
      log = []
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 1])
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 2])
      expect(log).toEqual([[undefined, true, 1], [undefined, true, 2]])

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
      s.on 'value', ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (end)', ->
      s = prop()
      s.on 'end', ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (any)', ->
      s = prop()
      s.on 'any', ->
      expect(s).toBeActive()

    it 'should deactivate when all subscribers removed', ->
      s = prop()
      s.on 'any', (any1 = ->)
      s.on 'any', (any2 = ->)
      s.on 'value', (value1 = ->)
      s.on 'value', (value2 = ->)
      s.on 'end', (end1 = ->)
      s.on 'end', (end2 = ->)
      s.off 'value', value1
      s.off 'value', value2
      s.off 'any', any1
      s.off 'any', any2
      s.off 'end', end1
      expect(s).toBeActive()
      s.off 'end', end2
      expect(s).not.toBeActive()


  describe 'subscribers', ->

    it 'should deliver values and current', ->
      s = send(prop(), [0])
      expect(s).toEmit [{current: 0}, 1, 2], -> send(s, [1, 2])
