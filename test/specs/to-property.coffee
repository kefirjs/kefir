{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'toProperty', ->


  describe 'stream', ->

    it 'should return property', ->
      expect(stream().toProperty()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.toProperty()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).toProperty()).toEmit ['<end:current>']

    it 'should be ended if source was ended (with current)', ->
      expect(send(stream(), ['<end>']).toProperty(0)).toEmit [{current: 0}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      p = a.toProperty(0)
      expect(p).toEmit [{current: 0}, 1, {error: 3}, 2, '<end>'], ->
        send(a, [1, {error: 3}, 2, '<end>'])
      expect(p).toEmit [{current: 2}, {currentError: 3}, '<end:current>']


  describe 'property', ->

    it 'should not have .toProperty method', ->
      expect(prop().toProperty).toBe(undefined)


