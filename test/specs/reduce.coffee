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


