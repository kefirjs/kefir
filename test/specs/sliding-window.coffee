{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'slidingWindow', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().slidingWindow(1)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.slidingWindow(1)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).slidingWindow(1)).toEmit ['<end:current>']

    it '.slidingWindow(3) should work correctly', ->
      a = stream()
      expect(a.slidingWindow(3)).toEmit [
        [1]
        [1, 2]
        [1, 2, 3]
        [2, 3, 4]
        [3, 4, 5]
        '<end>'
      ], -> send(a, [1, 2, 3, 4, 5,'<end>'])

    it '.slidingWindow(3, 2) should work correctly', ->
      a = stream()
      expect(a.slidingWindow(3, 2)).toEmit [
        [1, 2]
        [1, 2, 3]
        [2, 3, 4]
        [3, 4, 5]
        '<end>'
      ], -> send(a, [1, 2, 3, 4, 5,'<end>'])

    it '.slidingWindow(3, 3) should work correctly', ->
      a = stream()
      expect(a.slidingWindow(3, 3)).toEmit [
        [1, 2, 3]
        [2, 3, 4]
        [3, 4, 5]
        '<end>'
      ], -> send(a, [1, 2, 3, 4, 5,'<end>'])

    it '.slidingWindow(3, 4) should work correctly', ->
      a = stream()
      expect(a.slidingWindow(3, 4)).toEmit ['<end>'], ->
        send(a, [1, 2, 3, 4, 5,'<end>'])




  describe 'property', ->

    it 'should return property', ->
      expect(prop().slidingWindow(1)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.slidingWindow(1)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).slidingWindow(1)).toEmit ['<end:current>']

    it '.slidingWindow(3) should work correctly', ->
      a = send(prop(), [1])
      expect(a.slidingWindow(3)).toEmit [
        {current: [1]}
        [1, 2]
        [1, 2, 3]
        [2, 3, 4]
        [3, 4, 5]
        '<end>'
      ], -> send(a, [2, 3, 4, 5,'<end>'])

    it '.slidingWindow(3, 2) should work correctly', ->
      a = send(prop(), [1])
      expect(a.slidingWindow(3, 2)).toEmit [
        [1, 2]
        [1, 2, 3]
        [2, 3, 4]
        [3, 4, 5]
        '<end>'
      ], -> send(a, [2, 3, 4, 5,'<end>'])

    it '.slidingWindow(3, 3) should work correctly', ->
      a = send(prop(), [1])
      expect(a.slidingWindow(3, 3)).toEmit [
        [1, 2, 3]
        [2, 3, 4]
        [3, 4, 5]
        '<end>'
      ], -> send(a, [2, 3, 4, 5,'<end>'])

    it '.slidingWindow(3, 4) should work correctly', ->
      a = send(prop(), [1])
      expect(a.slidingWindow(3, 4)).toEmit ['<end>'], ->
        send(a, [2, 3, 4, 5,'<end>'])
