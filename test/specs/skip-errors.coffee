{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'skipErrors', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().skipErrors()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.skipErrors()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).skipErrors()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.skipErrors()).toEmit [1, 2, '<end>'], ->
        send(a, [1, {error: -1}, 2, {error: -2}, '<end>'])





  describe 'property', ->

    it 'should return property', ->
      expect(prop().skipErrors()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.skipErrors()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).skipErrors()).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [{error: -1}])
      expect(a.skipErrors()).toEmit [2, 3, '<end>'], ->
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])
      a = send(prop(), [1])
      expect(a.skipErrors()).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])




