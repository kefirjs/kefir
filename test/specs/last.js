{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'last', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().last()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.last()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).last()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.last()).toEmit [{error: 5}, {error: 6}, 3, '<end>'], ->
        send(a, [1, {error: 5}, {error: 6}, 2, 3, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().last()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.last()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).last()).toEmit ['<end:current>']
      expect(send(prop(), [1, '<end>']).last()).toEmit [{current: 1}, '<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.last()).toEmit [{error: 5}, 1, '<end>'], ->
        send(a, [{error: 5}, '<end>'])

      a = send(prop(), [{error: 0}])
      expect(a.last()).toEmit [{currentError: 0}, {error: 5}, 3, '<end>'], ->
        send(a, [2, {error: 5}, 3, '<end>'])


