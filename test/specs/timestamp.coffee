{stream, prop, send, Kefir} = require('../test-helpers.coffee')


describe 'timestamp', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().timestamp()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.timestamp()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).timestamp()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.timestamp()).toEmitInTime [
        [0, {value: 1, time: 10000}]
        [50, {value: 2, time: 10050}]
        [150, '<end>']
      ], (tick) ->
        send(a, [1])
        tick(50)
        send(a, [2])
        tick(100)
        send(a, ['<end>'])


  describe 'property', ->

    it 'should return property', ->
      expect(prop().timestamp()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.timestamp()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).timestamp()).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.timestamp()).toEmitInTime [
        [0, {current: {value: 1, time: 10000}}]
        [0, {value: 2, time: 10000}]
        [50, {value: 3, time: 10050}]
        [150, '<end>']
      ], (tick) ->
        send(a, [2])
        tick(50)
        send(a, [3])
        tick(100)
        send(a, ['<end>'])
