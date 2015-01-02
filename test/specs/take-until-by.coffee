{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'takeUntilBy', ->

  describe 'common', ->

    it 'errors should flow', ->
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).errorsToFlow(a)
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).errorsToFlow(b)
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).errorsToFlow(a)
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).errorsToFlow(b)
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).errorsToFlow(a)
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).errorsToFlow(b)
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).errorsToFlow(a)
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).errorsToFlow(b)





  describe 'stream, stream', ->

    it 'should return a stream', ->
      expect(stream().takeUntilBy(stream())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).takeUntilBy(stream())).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended', ->
      expect(stream().takeUntilBy(send(stream(), ['<end>']))).toEmit []

    it 'should not end when secondary ends if there was no values from it', ->
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).toEmit [], ->
        send(b, ['<end>'])

    it 'should end on first any value from secondary', ->
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).toEmit ['<end>'], ->
        send(b, [0])

    it 'should emit values from primary until first value from secondary', ->
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).toEmit [1, 2], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = stream()
      b = stream()
      expect(a.takeUntilBy(b)).toEmit [3, 4, '<end>'], ->
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])


  describe 'stream, property', ->

    it 'should return a stream', ->
      expect(stream().takeUntilBy(prop())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).takeUntilBy(prop())).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended and has no current', ->
      expect(stream().takeUntilBy(send(prop(), ['<end>']))).toEmit []

    it 'should be ended if secondary was ended and has any current', ->
      expect(stream().takeUntilBy(send(prop(), [0, '<end>']))).toEmit ['<end:current>']

    it 'should end on first any value from secondary', ->
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).toEmit ['<end>'], ->
        send(b, [0])

    it 'should not end when secondary ends there was no values from it', ->
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).toEmit [], ->
        send(b, ['<end>'])

    it 'should emit values from primary until first value from secondary', ->
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).toEmit [1, 2], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = stream()
      b = prop()
      expect(a.takeUntilBy(b)).toEmit [3, 4, '<end>'], ->
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])


  describe 'property, stream', ->

    it 'should return a property', ->
      expect(prop().takeUntilBy(stream())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).takeUntilBy(stream())).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended', ->
      expect(prop().takeUntilBy(send(stream(), ['<end>']))).toEmit []

    it 'should not end when secondary ends if there was no values from it', ->
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).toEmit [], ->
        send(b, ['<end>'])

    it 'should end on first any value from secondary', ->
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).toEmit ['<end>'], ->
        send(b, [0])

    it 'should emit values from primary until first value from secondary', ->
      a = prop()
      b = stream()
      expect(a.takeUntilBy(b)).toEmit [1, 2], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = send(prop(), [0])
      b = stream()
      expect(a.takeUntilBy(b)).toEmit [{current: 0}, 3, 4, '<end>'], ->
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])

  describe 'property, property', ->

    it 'should return a property', ->
      expect(prop().takeUntilBy(prop())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).takeUntilBy(prop())).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended and has no current', ->
      expect(prop().takeUntilBy(send(prop(), ['<end>']))).toEmit []

    it 'should be ended if secondary was ended and has any current', ->
      expect(prop().takeUntilBy(send(prop(), [0, '<end>']))).toEmit ['<end:current>']

    it 'should end on first any value from secondary', ->
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).toEmit ['<end>'], ->
        send(b, [0])

    it 'should not end when secondary ends if there was no values from it', ->
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).toEmit [], ->
        send(b, ['<end>'])

    it 'should emit values from primary until first value from secondary', ->
      a = prop()
      b = prop()
      expect(a.takeUntilBy(b)).toEmit [1, 2], ->
        send(a, [1, 2])

    it 'should take values as expected', ->
      a = send(prop(), [0])
      b = prop()
      expect(a.takeUntilBy(b)).toEmit [{current: 0}, 3, 4, '<end>'], ->
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9])
