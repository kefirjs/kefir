{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'skipEnd', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().skipEnd()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.skipEnd()).toActivate(a)

    it 'should not be ended if source was ended', ->
      expect(send(stream(), ['<end>']).skipEnd()).toEmit []

    it 'should handle events', ->
      a = stream()
      expect(a.skipEnd()).toEmit [1, 2], ->
        send(a, [1, 2, '<end>'])

    it 'errors should flow', ->
      a = stream()
      expect(a.skipEnd()).errorsToFlow(a)



  describe 'property', ->

    it 'should return property', ->
      expect(prop().skipEnd()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.skipEnd()).toActivate(a)

    it 'should not be ended if source was ended', ->
      expect(send(prop(), ['<end>']).skipEnd()).toEmit []
      expect(send(prop(), [1, '<end>']).skipEnd()).toEmit [{current: 1}]

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.skipEnd()).toEmit [{current: 1}, 2, 3], ->
        send(a, [2, 3, '<end>'])

    it 'errors should flow', ->
      a = prop()
      expect(a.skipEnd()).errorsToFlow(a)


