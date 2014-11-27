{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'withDefault', ->


  describe 'stream', ->

    it 'should return property', ->
      expect(stream().withDefault(0)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.withDefault(0)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).withDefault(0)).toEmit [{current: 0}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.withDefault(0)).toEmit [{current: 0}, 1, 2, '<end>'], ->
        send(a, [1, 2, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().withDefault(0)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.withDefault(0)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).withDefault(0)).toEmit [{current: 0}, '<end:current>']
      expect(send(prop(), [1, '<end>']).withDefault(0)).toEmit [{current: 1}, '<end:current>']

    it 'should handle events', ->
      a = send(prop(), [1])
      expect(a.withDefault(0)).toEmit [{current: 1}, 2, '<end>'], ->
        send(a, [2, '<end>'])
      a = prop()
      expect(a.withDefault(0)).toEmit [{current: 0}, 2, '<end>'], ->
        send(a, [2, '<end>'])


