{stream, prop, send, Kefir} = require('../test-helpers.coffee')

noop = ->
minus = (prev, next) -> prev - next

describe 'reduce', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().reduce noop, 0).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.reduce noop, 0).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).reduce noop, 0).toEmit [{current: 0}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.reduce minus, 0).toEmit [-4, '<end>'], ->
        send(a, [1, 3, '<end>'])

    it 'if no seed provided uses first value as seed', ->
      a = stream()
      expect(a.reduce minus).toEmit [-4, '<end>'], ->
        send(a, [0, 1, 3, '<end>'])
      a = stream()
      expect(a.reduce minus).toEmit [0, '<end>'], ->
        send(a, [0, '<end>'])
      a = stream()
      expect(a.reduce minus).toEmit ['<end>'], ->
        send(a, ['<end>'])

    it 'errors should flow', ->
      a = stream()
      expect(a.reduce minus).errorsToFlow(a)




  describe 'property', ->

    it 'should return property', ->
      expect(prop().reduce noop, 0).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.reduce noop, 0).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).reduce noop, 0).toEmit [{current: 0}, '<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.reduce minus, 0).toEmit [-10, '<end>'], ->
        send(a, [3, 6, '<end>'])

    it 'if no seed provided uses first value as seed', ->
      a = send(prop(), [0])
      expect(a.reduce minus).toEmit [-4, '<end>'], ->
        send(a, [1, 3, '<end>'])
      a = send(prop(), [0])
      expect(a.reduce minus).toEmit [0, '<end>'], ->
        send(a, ['<end>'])
      a = send(prop(), [0, '<end>'])
      expect(a.reduce minus).toEmit [{ current : 0 }, '<end:current>']

    it 'errors should flow', ->
      a = prop()
      expect(a.reduce minus).errorsToFlow(a)



