{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'mapEnd', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().mapEnd ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.mapEnd ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).mapEnd -> 42).toEmit [{current: 42}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.mapEnd -> 42).toEmit [1, 2, 42, '<end>'], ->
        send(a, [1, 2, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().mapEnd ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.mapEnd ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).mapEnd -> 42).toEmit [{current: 42}, '<end:current>']
      expect(send(prop(), [1, '<end>']).mapEnd -> 42).toEmit [{current: 42}, '<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.mapEnd -> 42).toEmit [{current: 1}, 2, 3, 42, '<end>'], ->
        send(a, [2, 3, '<end>'])


