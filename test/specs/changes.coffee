{stream, prop, send, Kefir} = require('../test-helpers.coffee')


describe 'changes', ->


  describe 'stream', ->

    it 'should just return same stream', ->
      a = stream()
      expect(a.changes()).toBe(a)


  describe 'property', ->

    it 'should return stream', ->
      expect(prop().changes()).toBeStream()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.changes()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).changes()).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1, {error: 4}])
      expect(a.changes()).toEmit [2, {error: 5}, 3, '<end>'], ->
        send(a, [2, {error: 5}, 3, '<end>'])


