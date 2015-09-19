{stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'flatMap', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().flatMap()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.flatMap()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).flatMap()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      expect(a.flatMap()).toEmit [1, 2, 0, 3, 4, '<end>'], ->
        send(b, [0])
        send(a, [b])
        send(b, [1, 2])
        send(a, [c, '<end>'])
        send(b, [3, '<end>'])
        send(c, [4, '<end>'])

    it 'should activate sub-sources', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      map = a.flatMap()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).toActivate(b, c)

    it 'should accept optional map fn', ->
      a = stream()
      b = stream()
      expect(a.flatMap((x) -> x.obs)).toEmit [1, 2, '<end>'], ->
        send(b, [0])
        send(a, [{obs: b}, '<end>'])
        send(b, [1, 2, '<end>'])

    it 'should correctly handle current values of sub sources on activation', ->
      a = stream()
      b = send(prop(), [1])
      c = send(prop(), [2])
      m = a.flatMap()
      activate(m)
      send(a, [b, c])
      deactivate(m)
      expect(m).toEmit [{current: 1}, {current: 2}]

    it 'should correctly handle current values of new sub sources', ->
      a = stream()
      b = send(prop(), [1])
      c = send(prop(), [2])
      expect(a.flatMap()).toEmit [1, 2], ->
        send(a, [b, c])

    it 'should work nicely with Kefir.constant and Kefir.never', ->
      a = stream()
      expect(
        a.flatMap (x) ->
          if x > 2
            Kefir.constant(x)
          else if x < 0
            Kefir.constantError(x)
          else
            Kefir.never()
      ).toEmit [3, {error: -1}, 4, {error: -2}, 5], ->
        send(a, [1, 2, 3, -1, 4, -2, 5])

    # https://github.com/rpominov/kefir/issues/29
    it 'Bug in flatMap: exception thrown when resubscribing to stream', ->
      src = stream()
      stream1 = src.flatMap((x) -> x)
      handler = ->
      stream1.onValue(handler)
      sub = stream()
      send(src, [sub, '<end>'])
      stream1.offValue(handler)
      send(sub, ['<end>'])
      # Throws exception
      stream1.onValue(handler)

    it 'errors should flow', ->
      a = stream()
      b = stream()
      c = prop()
      result = a.flatMap()
      activate(result)
      send(a, [b, c])
      deactivate(result)
      expect(result).errorsToFlow(a)
      expect(result).errorsToFlow(b)
      expect(result).errorsToFlow(c)

    # https://github.com/rpominov/kefir/issues/92
    it 'Bug "flatMap with take(1) doesn\'t unsubscribe from source"', ->

      subs = 0
      unsubs = 0
      a = Kefir.stream (emitter) ->
        subs++
        emitter.emit(1)
        -> unsubs++

      b = Kefir.constant(1).flatMap(-> a).take(1)

      b.onValue(->)

      expect(subs).toBe(1)
      expect(unsubs).toBe(1)


    it 'should be possible to add same obs twice on activation', ->
      b = send(prop(), [1])
      a = Kefir.stream (em) ->
        em.emit(b)
        em.emit(b)
      expect(a.flatMap()).toEmit [{current: 1}, {current: 1}]




  describe 'property', ->

    it 'should return stream', ->
      expect(prop().flatMap()).toBeStream()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.flatMap()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).flatMap()).toEmit ['<end:current>']

    it 'should be ended if source was ended (with value)', ->
      expect(
        send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMap()
      ).toEmit [{current: 0}, '<end:current>']

    it 'should not costantly adding current value on each activation', ->
      a = send(prop(), [0])
      b = send(prop(), [a])
      map = b.flatMap()
      activate(map)
      deactivate(map)
      activate(map)
      deactivate(map)
      expect(map).toEmit [{current: 0}]

    it 'should allow to add same obs several times', ->
      b = send(prop(), ['b0'])
      c = stream()
      a = send(prop(), [b])
      expect(a.flatMap()).toEmit [
        {current: 'b0'}, 'b0', 'b0', 'b0', 'b0',
        'b1', 'b1', 'b1', 'b1', 'b1',
        'c1', 'c1', 'c1',
        '<end>'
      ], ->
        send(a, [b, c, b, c, c, b, b, '<end>'])
        send(b, ['b1', '<end>'])
        send(c, ['c1', '<end>'])

    it 'should correctly handle current value of source', ->
      a = send(prop(), [0])
      b = send(prop(), [a])
      expect(b.flatMap()).toEmit [{current: 0}]

    it 'errors should flow 1', ->
      a = prop()
      result = a.flatMap()
      expect(result).errorsToFlow(a)

    it 'errors should flow 2', ->
      a = prop()
      b = stream()
      c = prop()
      result = a.flatMap()
      activate(result)
      send(a, [b, c])
      deactivate(result)
      expect(result).errorsToFlow(b)
      expect(result).errorsToFlow(c)


