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
      p = a.withDefault(0)
      expect(p).toEmit [{current: 0}, 1, {error: 3}, 2, '<end>'], ->
        send(a, [1, {error: 3}, 2, '<end>'])
      expect(p).toEmit [{current: 2}, {currentError: 3}, '<end:current>']



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
      b = a.withDefault(0)
      expect(b).toEmit [{current: 1}, 2, {error: 3}, '<end>'], ->
        send(a, [2, {error: 3}, '<end>'])
      expect(b).toEmit [{current: 2}, {currentError: 3}, '<end:current>']

      a = prop()
      b = a.withDefault(0)
      expect(b).toEmit [{current: 0}, 2, {error: 3}, '<end>'], ->
        send(a, [2, {error: 3}, '<end>'])
      expect(b).toEmit [{current: 2}, {currentError: 3}, '<end:current>']



