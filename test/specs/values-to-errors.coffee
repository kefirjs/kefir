{stream, prop, send, Kefir} = require('../test-helpers.coffee')


handler = (x) ->
  convert: x < 0
  error: x * 3


describe 'valuesToErrors', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().valuesToErrors ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.valuesToErrors ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).valuesToErrors ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.valuesToErrors handler).toEmit [1, {error: -6}, {error: -3}, {error: -12}, 5, '<end>'], ->
        send(a, [
          1
          -2
          {error: -3}
          -4
          5
          '<end>'
        ])

    it 'default handler should convert all values', ->
      a = stream()
      expect(a.valuesToErrors()).toEmit [{error: 1}, {error: -2}, {error: -3}, {error: -4}, {error: 5}, '<end>'], ->
        send(a, [
          1
          -2
          {error: -3}
          -4
          5
          '<end>'
        ])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().valuesToErrors ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.valuesToErrors ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).valuesToErrors ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = send(prop(), [1])
      expect(a.valuesToErrors handler).toEmit [{current: 1}, {error: -6}, {error: -3}, {error: -12}, 5, '<end>'], ->
        send(a, [
          -2
          {error: -3}
          -4
          5
          '<end>'
        ])

    it 'should handle currents', ->
      a = send(prop(), [2])
      expect(a.valuesToErrors handler).toEmit([current: 2])
      a = send(prop(), [-2])
      expect(a.valuesToErrors handler).toEmit([currentError: -6])
      a = send(prop(), [-5, {error: -2}])
      expect(a.valuesToErrors handler).toEmit([{currentError: -2}])
      a = send(prop(), [{error: -2}, -5])
      expect(a.valuesToErrors handler).toEmit([{currentError: -2}])
      a = send(prop(), [{error: -2}])
      expect(a.valuesToErrors handler).toEmit([{currentError: -2}])
      a = send(prop(), [1, {error: -2}])
      expect(a.valuesToErrors handler).toEmit([{current: 1}, {currentError: -2}])


