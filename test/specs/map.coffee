{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'map', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().map ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.map ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).map ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.map (x) -> x * 2).toEmit [2, 4, '<end>'], ->
        send(a, [1, 2, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().map ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.map ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).map ->).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.map (x) -> x * 2).toEmit [{current: 2}, 4, 6, '<end>'], ->
        send(a, [2, 3, '<end>'])


