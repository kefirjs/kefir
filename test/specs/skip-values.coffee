{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'skipValues', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().skipValues()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.skipValues()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).skipValues()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.skipValues()).toEmit [{error: -1}, {error: -2}, '<end>'], ->
        send(a, [1, {error: -1}, 2, {error: -2}, '<end>'])





  describe 'property', ->

    it 'should return property', ->
      expect(prop().skipValues()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.skipValues()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).skipValues()).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1, {error: -1}])
      expect(a.skipValues()).toEmit [{currentError: -1}, {error: -2}, {error: -3}, '<end>'], ->
        send(a, [2, {error: -2}, 3, {error: -3}, '<end>'])




