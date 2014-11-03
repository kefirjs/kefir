{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'takeWhileBy', ->

  describe 'stream, stream', ->

    it 'should return a stream', ->
      expect(stream().takeWhileBy(stream())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = stream()
      expect(a.takeWhileBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).takeWhileBy(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(stream().takeWhileBy(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should not end when secondary ends if only value from it was truthy', ->
      a = stream()
      b = stream()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should end on first falsy value from secondary', ->
      a = stream()
      b = stream()
      expect(a.takeWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, false])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = stream()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = stream()
      b = stream()
      expect(a.takeWhileBy(b)).toEmit [3, 4, 5, 6, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])


  describe 'stream, property', ->

    it 'should return a stream', ->
      expect(stream().takeWhileBy(prop())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = prop()
      expect(a.takeWhileBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).takeWhileBy(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(stream().takeWhileBy(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has falsy current', ->
      expect(stream().takeWhileBy(send(prop(), [false, '<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended but has truthy current', ->
      expect(stream().takeWhileBy(send(prop(), [true, '<end>']))).toEmit []

    it 'should end on first falsy value from secondary', ->
      a = stream()
      b = prop()
      expect(a.takeWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, false])

    it 'should not end when secondary ends if only value from it was truthy', ->
      a = stream()
      b = prop()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = prop()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = stream()
      b = prop()
      expect(a.takeWhileBy(b)).toEmit [3, 4, 5, 6, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])


  describe 'property, stream', ->

    it 'should return a property', ->
      expect(prop().takeWhileBy(stream())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = stream()
      expect(a.takeWhileBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).takeWhileBy(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(prop().takeWhileBy(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should not end when secondary ends if only value from it was truthy', ->
      a = prop()
      b = stream()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should end on first falsy value from secondary', ->
      a = prop()
      b = stream()
      expect(a.takeWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, false])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = stream()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = send(prop(), [0])
      b = stream()
      expect(a.takeWhileBy(b)).toEmit [3, 4, 5, 6, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])

  describe 'property, property', ->

    it 'should return a property', ->
      expect(prop().takeWhileBy(prop())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = prop()
      expect(a.takeWhileBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).takeWhileBy(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(prop().takeWhileBy(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has falsy current', ->
      expect(prop().takeWhileBy(send(prop(), [false, '<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended but has truthy current', ->
      expect(prop().takeWhileBy(send(prop(), [true, '<end>']))).toEmit []

    it 'should end on first falsy value from secondary', ->
      a = prop()
      b = prop()
      expect(a.takeWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, false])

    it 'should not end when secondary ends if only value from it was truthy', ->
      a = prop()
      b = prop()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = prop()
      expect(a.takeWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = send(prop(), [0])
      b = send(prop(), [true])
      expect(a.takeWhileBy(b)).toEmit [{current: 0}, 3, 4, 5, 6, '<end>'], ->
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])
