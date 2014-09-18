{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'skip', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().skip(3)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.skip(3)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).skip(3)).toEmit ['<end:current>']

    it 'should handle events (less than `n`)', ->
      a = stream()
      expect(a.skip(3)).toEmit ['<end>'], ->
        send(a, [1, 2, '<end>'])

    it 'should handle events (more than `n`)', ->
      a = stream()
      expect(a.skip(3)).toEmit [4, 5, '<end>'], ->
        send(a, [1, 2, 3, 4, 5, '<end>'])

    it 'should handle events (n == 0)', ->
      a = stream()
      expect(a.skip(0)).toEmit [1, 2, 3, '<end>'], ->
        send(a, [1, 2, 3, '<end>'])

    it 'should handle events (n == -1)', ->
      a = stream()
      expect(a.skip(-1)).toEmit [1, 2, 3, '<end>'], ->
        send(a, [1, 2, 3, '<end>'])




  describe 'property', ->

    it 'should return property', ->
      expect(prop().skip(3)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.skip(3)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).skip(3)).toEmit ['<end:current>']

    it 'should handle events and current (less than `n`)', ->
      a = send(prop(), [1])
      expect(a.skip(3)).toEmit ['<end>'], ->
        send(a, [2, '<end>'])

    it 'should handle events and current (more than `n`)', ->
      a = send(prop(), [1])
      expect(a.skip(3)).toEmit [4, 5, '<end>'], ->
        send(a, [2, 3, 4, 5, '<end>'])

    it 'should handle events and current (n == 0)', ->
      a = send(prop(), [1])
      expect(a.skip(0)).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [2, 3, '<end>'])

    it 'should handle events and current (n == -1)', ->
      a = send(prop(), [1])
      expect(a.skip(-1)).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [2, 3, '<end>'])




