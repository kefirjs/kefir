{stream, prop, send, Kefir} = require('../test-helpers.coffee')


handler = (x) ->
  convert: x >= 0
  value: x * 3


describe 'errorsToValues', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().errorsToValues ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.errorsToValues ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).errorsToValues ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.errorsToValues handler).toEmit [1, 6, {error: -1}, 9, 4, '<end>'], ->
        send(a, [
          1
          {error: 2}
          {error: -1}
          {error: 3}
          4
          '<end>'
        ])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().errorsToValues ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.errorsToValues ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).errorsToValues ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = send(prop(), [1])
      expect(a.errorsToValues handler).toEmit [{current: 1}, 6, {error: -1}, 9, 4, '<end>'], ->
        send(a, [
          {error: 2}
          {error: -1}
          {error: 3}
          4
          '<end>'
        ])

    it 'should handle currents', ->
      a = send(prop(), [{error: -2}])
      expect(a.errorsToValues handler).toEmit([{currentError: -2}])
      a = send(prop(), [{error: 2}])
      expect(a.errorsToValues handler).toEmit([{current: 6}])
      a = send(prop(), [1, {error: 2}])
      expect(a.errorsToValues handler).toEmit([{current: 6}])
      a = send(prop(), [{error: 2}, 1])
      expect(a.errorsToValues handler).toEmit([{current: 6}])
      a = send(prop(), [{error: -2}])
      expect(a.errorsToValues handler).toEmit([{currentError: -2}])
      a = send(prop(), [1, {error: -2}])
      expect(a.errorsToValues handler).toEmit([{current: 1}, {currentError: -2}])


