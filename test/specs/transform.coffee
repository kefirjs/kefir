{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'transform', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().transform ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.transform ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).transform ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(
        a.transform (x) -> if x > 1 then [1..x] else []
      ).toEmit [1, 2, 1, 2, 3, '<end>'], ->
        send(a, [1, 2, 3, '<end>'])

    it 'if no `fn` provided should use the `id` function by default', ->
      a = stream()
      expect(a.transform()).toEmit [1, 2, 3, '<end>'], ->
        send(a, [[1], [], [2, 3], '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().transform ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.transform ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).transform ->).toEmit ['<end:current>']

    it 'should handle events (handler skips current)', ->
      a = send(prop(), [1])
      expect(
        a.transform (x) -> if x > 1 then [1..x] else []
      ).toEmit [1, 2, 1, 2, 3, '<end>'], ->
        send(a, [2, 3, '<end>'])

    it 'should handle current correctly', ->
      expect(
        send(prop(), [1]).transform (x) -> [1..x]
      ).toEmit [{current: 1}]

    it 'should handle multiple currents correctly', ->
      expect(
        send(prop(), [2]).transform (x) -> [1..x]
      ).toEmit [{current: 2}]

    it 'if no `fn` provided should use the `id` function by default', ->
      a = send(prop(), [[1]])
      expect(a.transform()).toEmit [{current: 1}, 2, 3, 4, '<end>'], ->
        send(a, [[2], [], [3, 4], '<end>'])


