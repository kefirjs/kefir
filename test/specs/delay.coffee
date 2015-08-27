{stream, prop, send, shakyTimeTest, Kefir} = require('../test-helpers.coffee')

describe 'delay', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().delay(100)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.delay(100)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).delay(100)).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.delay(100)).toEmitInTime [[100, 1], [150, 2], [250, '<end>']], (tick) ->
        send(a, [1])
        tick(50)
        send(a, [2])
        tick(100)
        send(a, ['<end>'])

    it 'errors should flow', ->
      a = stream()
      expect(a.delay(100)).errorsToFlow(a)

    it 'works with undependable setTimeout', ->
      shakyTimeTest 2, (expectToEmitOverShakyTime) ->
        a = stream()
        expectToEmitOverShakyTime a.delay(0), [4, '<end>'], (tick) ->
          send(a, [4])
          send(a, ['<end>'])

  describe 'property', ->

    it 'should return property', ->
      expect(prop().delay(100)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.delay(100)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).delay(100)).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.delay(100)).toEmitInTime [[0, {current: 1}], [100, 2], [150, 3], [250, '<end>']], (tick) ->
        send(a, [2])
        tick(50)
        send(a, [3])
        tick(100)
        send(a, ['<end>'])

    it 'errors should flow', ->
      a = prop()
      expect(a.delay(100)).errorsToFlow(a)
