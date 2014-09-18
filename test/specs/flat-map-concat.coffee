{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'flatMapConcat', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().flatMapConcat()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.flatMapConcat()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).flatMapConcat()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      b = stream()
      c = stream()
      expect(a.flatMapConcat()).toEmit [1, 2, 5, 6, '<end>'], ->
        send(b, [0])
        send(a, [b])
        send(b, [1, 2])
        send(a, [c, '<end>'])
        send(c, [4])
        send(b, [5, '<end>'])
        send(c, [6, '<end>'])


    it 'should activate sub-sources', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      map = a.flatMapConcat()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).toActivate(b)
      expect(map).not.toActivate(c)
      send(b, ['<end>'])
      expect(map).toActivate(c)


    it 'should accept optional map fn', ->
      a = stream()
      b = stream()
      expect(a.flatMapConcat((x) -> x.obs)).toEmit [1, 2, '<end>'], ->
        send(b, [0])
        send(a, [{obs: b}, '<end>'])
        send(b, [1, 2, '<end>'])

    it 'should correctly handle current values of sub sources on activation', ->
      a = stream()
      b = send(prop(), [1])
      m = a.flatMapConcat()
      activate(m)
      send(a, [b])
      deactivate(m)
      expect(m).toEmit [{current: 1}]

    it 'should correctly handle current values of new sub sources', ->
      a = stream()
      b = send(prop(), [1, '<end>'])
      c = send(prop(), [2])
      d = send(prop(), [3])
      expect(a.flatMapConcat()).toEmit [1, 2], ->
        send(a, [b, c, d])

    it 'should work nicely with Kefir.constant and Kefir.never', ->
      a = stream()
      expect(
        a.flatMapConcat (x) ->
          if x > 2
            Kefir.constant(x)
          else
            Kefir.never()
      ).toEmit [3, 4, 5], ->
        send(a, [1, 2, 3, 4, 5])





  describe 'property', ->

    it 'should return stream', ->
      expect(prop().flatMapConcat()).toBeStream()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.flatMapConcat()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).flatMapConcat()).toEmit ['<end:current>']

    it 'should be ended if source was ended (with value)', ->
      expect(
        send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapConcat()
      ).toEmit [{current: 0}, '<end:current>']

    it 'should correctly handle current value of source', ->
      a = send(prop(), [0])
      b = send(prop(), [a])
      expect(b.flatMapConcat()).toEmit [{current: 0}]


