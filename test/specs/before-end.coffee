{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'beforeEnd', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().beforeEnd ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.beforeEnd ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).beforeEnd -> 42).toEmit [{current: 42}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.beforeEnd -> 42).toEmit [1, 2, 42, '<end>'], ->
        send(a, [1, 2, '<end>'])

    it 'errors should flow', ->
      a = stream()
      expect(a.beforeEnd ->).errorsToFlow(a)



  describe 'property', ->

    it 'should return property', ->
      expect(prop().beforeEnd ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.beforeEnd ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).beforeEnd -> 42).toEmit [{current: 42}, '<end:current>']
      expect(send(prop(), [1, '<end>']).beforeEnd -> 42).toEmit [{current: 42}, '<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.beforeEnd -> 42).toEmit [{current: 1}, 2, 3, 42, '<end>'], ->
        send(a, [2, 3, '<end>'])

    it 'errors should flow', ->
      a = prop()
      expect(a.beforeEnd ->).errorsToFlow(a)


