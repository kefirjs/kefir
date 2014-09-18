{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'flatMapFirst', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().flatMapFirst()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.flatMapFirst()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).flatMapFirst()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      b = stream()
      c = stream()
      expect(a.flatMapFirst()).toEmit [1, 2, 4, '<end>'], ->
        send(b, [0])
        send(a, [b])
        send(b, [1])
        send(a, [c])
        send(b, [2, '<end>'])
        send(c, [3])
        send(a, [c, '<end>'])
        send(c, [4, '<end>'])

    it 'should activate sub-sources (only first)', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      map = a.flatMapFirst()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).toActivate(b)
      expect(map).not.toActivate(c)

    it 'should accept optional map fn', ->
      a = stream()
      b = stream()
      expect(a.flatMapFirst((x) -> x.obs)).toEmit [1, 2, '<end>'], ->
        send(a, [{obs: b}, '<end>'])
        send(b, [1, 2, '<end>'])

    it 'should correctly handle current values of sub sources on activation', ->
      a = stream()
      b = send(prop(), [1])
      c = send(prop(), [2])
      m = a.flatMapFirst()
      activate(m)
      send(a, [b, c])
      deactivate(m)
      expect(m).toEmit [{current: 1}]

    it 'should correctly handle current values of new sub sources', ->
      a = stream()
      b = send(prop(), [1, '<end>'])
      c = send(prop(), [2])
      d = send(prop(), [3])
      expect(a.flatMapFirst()).toEmit [1, 2], ->
        send(a, [b, c, d])

    it 'should work nicely with Kefir.constant and Kefir.never', ->
      a = stream()
      expect(
        a.flatMapFirst (x) ->
          if x > 2
            Kefir.constant(x)
          else
            Kefir.never()
      ).toEmit [3, 4, 5], ->
        send(a, [1, 2, 3, 4, 5])





  describe 'property', ->

    it 'should return stream', ->
      expect(prop().flatMapFirst()).toBeStream()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.flatMapFirst()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).flatMapFirst()).toEmit ['<end:current>']

    it 'should be ended if source was ended (with value)', ->
      expect(
        send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapFirst()
      ).toEmit [{current: 0}, '<end:current>']

    it 'should correctly handle current value of source', ->
      a = send(prop(), [0])
      b = send(prop(), [a])
      expect(b.flatMapFirst()).toEmit [{current: 0}]
