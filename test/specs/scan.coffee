{stream, prop, send, Kefir} = require('../test-helpers.coffee')

noop = ->
minus = (prev, next) -> prev - next

describe 'scan', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().scan noop, 0).toBeProperty()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.scan noop, 0).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).scan noop, 0).toEmit [{current: 0}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.scan minus, 0).toEmit [{current: 0}, -1, -4, '<end>'], ->
        send(a, [1, 3, '<end>'])

    it 'if no seed provided uses first value as seed', ->
      a = stream()
      expect(a.scan minus).toEmit [0, -1, -4, '<end>'], ->
        send(a, [0, 1, 3, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().scan noop, 0).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.scan noop, 0).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).scan noop, 0).toEmit [{current: 0}, '<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.scan minus, 0).toEmit [{current: -1}, -4, -10, '<end>'], ->
        send(a, [3, 6, '<end>'])

    it 'if no seed provided uses first value as seed', ->
      a = send(prop(), [0])
      expect(a.scan minus).toEmit [{current: 0}, -1, -4, '<end>'], ->
        send(a, [1, 3, '<end>'])


