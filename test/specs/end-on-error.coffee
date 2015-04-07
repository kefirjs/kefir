{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'endOnError', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().endOnError()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.endOnError()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).endOnError()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.endOnError()).toEmit [1, {error: 5}, '<end>'], ->
        send(a, [1, {error: 5}, 2])
      a = stream()
      expect(a.endOnError()).toEmit [1, 2, '<end>'], ->
        send(a, [1, 2, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().endOnError()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.endOnError()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).endOnError()).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.endOnError()).toEmit [{current: 1}, {error: 5}, '<end>'], ->
        send(a, [{error: 5}, 2])
      a = send(prop(), [1])
      expect(a.endOnError()).toEmit [{current: 1}, 2, '<end>'], ->
        send(a, [2, '<end>'])

    it 'should handle currents', ->
      a = send(prop(), [{error: -1}])
      expect(a.endOnError()).toEmit [{currentError: -1}, '<end:current>']
      a = send(prop(), [{error: -1}, '<end>'])
      expect(a.endOnError()).toEmit [{currentError: -1}, '<end:current>']
      a = send(prop(), [1])
      expect(a.endOnError()).toEmit [{current: 1}]
      a = send(prop(), [1, '<end>'])
      expect(a.endOnError()).toEmit [{current: 1}, '<end:current>']
