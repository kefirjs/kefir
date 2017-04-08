{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')
sinon = require('sinon')


describe 'flatMapLatest', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().flatMapLatest()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.flatMapLatest()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).flatMapLatest()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      expect(a.flatMapLatest()).toEmit [1, 0, 3, 5, '<end>'], ->
        send(b, [0])
        send(a, [b])
        send(b, [1])
        send(a, [c])
        send(b, [2])
        send(c, [3])
        send(a, [b, '<end>'])
        send(c, [4])
        send(b, [5, '<end>'])

    it 'should activate sub-sources (only latest)', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      map = a.flatMapLatest()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).toActivate(c)
      expect(map).not.toActivate(b)

    it 'should accept optional map fn', ->
      a = stream()
      b = stream()
      expect(a.flatMapLatest((x) -> x.obs)).toEmit [1, 2, '<end>'], ->
        send(a, [{obs: b}, '<end>'])
        send(b, [1, 2, '<end>'])

    it 'should correctly handle current values of sub sources on activation', ->
      a = stream()
      b = send(prop(), [1])
      c = send(prop(), [2])
      m = a.flatMapLatest()
      activate(m)
      send(a, [b, c])
      deactivate(m)
      expect(m).toEmit [{current: 2}]

    it 'should correctly handle current values of new sub sources', ->
      a = stream()
      b = send(prop(), [1])
      c = send(prop(), [2])
      expect(a.flatMapLatest()).toEmit [1, 2], ->
        send(a, [b, c])

    it 'should work nicely with Kefir.constant and Kefir.never', ->
      a = stream()
      expect(
        a.flatMapLatest (x) ->
          if x > 2
            Kefir.constant(x)
          else
            Kefir.never()
      ).toEmit [3, 4, 5], ->
        send(a, [1, 2, 3, 4, 5])





  describe 'property', ->

    it 'should return stream', ->
      expect(prop().flatMapLatest()).toBeStream()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.flatMapLatest()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).flatMapLatest()).toEmit ['<end:current>']

    it 'should be ended if source was ended (with value)', ->
      expect(
        send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapLatest()
      ).toEmit [{current: 0}, '<end:current>']

    it 'should correctly handle current value of source', ->
      a = send(prop(), [0])
      b = send(prop(), [a])
      expect(b.flatMapLatest()).toEmit [{current: 0}]


  describe 'non-overlapping', ->
    it 'should remove the previous stream before adding the next', ->
      onDeactivate = sinon.spy()
      a = Kefir.stream(-> onDeactivate)
      b = stream()
      map = b.flatMapLatest()
      activate(map)
      send(b, [a])
      send(b, [a])
      deactivate(map)
      expect(onDeactivate.callCount).toBe(2)


  describe 'overlapping', ->
    it 'should add the next stream before removing the previous', ->
      onDeactivate = sinon.spy()
      a = Kefir.stream(-> onDeactivate)
      b = stream()
      map = b.flatMapLatest({ overlapping: true })
      activate(map)
      send(b, [a])
      send(b, [a])
      deactivate(map)
      expect(onDeactivate.callCount).toBe(1)

    it 'should accept optional map fn', ->
      onDeactivate = sinon.spy()
      a = Kefir.stream(-> onDeactivate)
      b = stream()
      map = b.flatMapLatest(((x) -> x.obs), { overlapping: true })
      activate(map)
      send(b, [{ obs: a }])
      send(b, [{ obs: a }])
      deactivate(map)
      expect(onDeactivate.callCount).toBe(1)

    it 'should work nicely with Kefir.constant and Kefir.never', ->
      a = stream()
      handle = (x) ->
        if x > 2
          Kefir.constant(x)
        else
          Kefir.never()
      expect(
        a.flatMapLatest(handle, { overlapping: true })
      ).toEmit [3, 4, 5], ->
        send(a, [1, 2, 3, 4, 5])
