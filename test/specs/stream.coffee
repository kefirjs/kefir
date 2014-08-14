Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, send, activate} = helpers


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
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 1])
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 2])
      expect(log).toEqual([])
      send(s, ['<end>'])
      expect(log).toEqual([[undefined, false, 1], [undefined, false, 2]])

    it 'should call `end` subscribers on already ended stream', ->
      s = stream()
      send(s, ['<end>'])
      log = []
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 1])
      s.on 'end', (x, isCurrent) -> log.push([x, isCurrent, 2])
      expect(log).toEqual([[undefined, true, 1], [undefined, true, 2]])

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
      s.on 'value', ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (end)', ->
      s = stream()
      s.on 'end', ->
      expect(s).toBeActive()

    it 'should activate when first subscriber added (any)', ->
      s = stream()
      s.on 'any', ->
      expect(s).toBeActive()

    it 'should deactivate when all subscribers removed', ->
      s = stream()
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

    it 'should deliver values', ->
      s = stream()
      expect(s).toEmit [1, 2], -> send(s, [1, 2])




  describe 'listener with context and/or args', ->

    it 'listener should be called with specified context', ->
      s = stream()
      log = []
      obj = {
        name: 'foo',
        getName: -> log.push @name
      }
      s.on 'value', [obj.getName, obj]
      send(s, [1])
      expect(log).toEqual(['foo'])

    it 'listener should be called with specified args', ->
      s = stream()
      log = []
      obj = {
        name: 'foo',
        getName: (a, b, c) -> log.push(@name + a + b + c)
      }
      s.on 'value', [obj.getName, obj, 'b', 'a']
      send(s, ['r'])
      expect(log).toEqual(['foobar'])

    it 'fn can be passed as string (name of method in context)', ->
      s = stream()
      log = []
      obj = {
        name: 'foo',
        getName: -> log.push @name
      }
      s.on 'value', ['getName', obj]
      send(s, [1])
      expect(log).toEqual(['foo'])
