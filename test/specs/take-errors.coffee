{stream, prop, send, Kefir, pool} = require('../test-helpers.coffee')



describe 'takeErrors', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().takeErrors(3)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.takeErrors(3)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).takeErrors(3)).toEmit ['<end:current>']

    it 'should be ended if `n` is 0', ->
      expect(stream().takeErrors(0)).toEmit ['<end:current>']

    it 'should handle events (less than `n`)', ->
      a = stream()
      expect(a.takeErrors(3)).toEmit [{error: 1}, {error: 2}, '<end>'], ->
        send(a, [{error: 1}, {error: 2}, '<end>'])

    it 'should handle events (more than `n`)', ->
      a = stream()
      expect(a.takeErrors(3)).toEmit [{error: 1}, {error: 2}, {error: 3}, '<end>'], ->
        send(a, [{error: 1}, {error: 2}, {error: 3}, {error: 4}, {error: 5}, '<end>'])

    it 'values should flow', ->
      a = stream()
      expect(a.takeErrors(1)).toEmit [1, 2, 3, '<end>'], ->
        send(a, [1, 2, 3, '<end>'])

    it 'should emit once on circular dependency', ->
      a = pool()
      b = a.takeErrors(1).mapErrors((x) -> x + 1)
      a.plug(b)

      expect(b).toEmit [{error: 2}, '<end>'], ->
        send(a, [{error: 1}, {error: 2}, {error: 3}, {error: 4}, {error: 5}])




  describe 'property', ->

    it 'should return property', ->
      expect(prop().takeErrors(3)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.takeErrors(3)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).takeErrors(3)).toEmit ['<end:current>']

    it 'should be ended if `n` is 0', ->
      expect(prop().takeErrors(0)).toEmit ['<end:current>']

    it 'should handle events and current (less than `n`)', ->
      a = send(prop(), [{error: 1}])
      expect(a.takeErrors(3)).toEmit [{currentError: 1}, {error: 2}, '<end>'], ->
        send(a, [{error: 2}, '<end>'])

    it 'should handle events and current (more than `n`)', ->
      a = send(prop(), [{error: 1}])
      expect(a.takeErrors(3)).toEmit [{currentError: 1}, {error: 2}, {error: 3}, '<end>'], ->
        send(a, [{error: 2}, {error: 3}, {error: 4}, {error: 5}, '<end>'])

    it 'should work correctly with .constant', ->
      expect(Kefir.constantError(1).takeErrors(1)).toEmit([{currentError: 1}, '<end:current>'])

    it 'values should flow', ->
      a = send(prop(), [1])
      expect(a.takeErrors(1)).toEmit [{current: 1}, 2, 3, 4, '<end>'], ->
        send(a, [2, 3, 4, '<end>'])




