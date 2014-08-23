Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send} = helpers

describe 'withHandler', ->


  mirror = (send, event) ->
    send(event.type, event.value, event.current)

  duplicate = (send, event) ->
    send(event.type, event.value, event.current)
    if event.type == 'value' && !event.current
      send(event.type, event.value)


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().withHandler ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.withHandler ->).toActivate(a)

    it 'should not be ended if source was ended (by default)', ->
      expect(send(stream(), ['<end>']).withHandler ->).toEmit []

    it 'should be ended if source was ended (with `mirror` handler)', ->
      expect(send(stream(), ['<end>']).withHandler mirror).toEmit ['<end:current>']

    it 'should handle events (with `duplicate` handler)', ->
      a = stream()
      expect(a.withHandler duplicate).toEmit [1, 1, 2, 2, '<end>'], ->
        send(a, [1, 2, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().withHandler ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.withHandler ->).toActivate(a)

    it 'should not be ended if source was ended (by default)', ->
      expect(send(prop(), ['<end>']).withHandler ->).toEmit []

    it 'should be ended if source was ended (with `mirror` handler)', ->
      expect(send(prop(), ['<end>']).withHandler mirror).toEmit ['<end:current>']

    it 'should handle events and current (with `duplicate` handler)', ->
      a = send(prop(), [1])
      expect(a.withHandler duplicate).toEmit [{current: 1}, 2, 2, 3, 3, '<end>'], ->
        send(a, [2, 3, '<end>'])


