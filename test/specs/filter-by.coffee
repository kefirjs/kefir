{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'filterBy', ->

  describe 'stream, stream', ->

    it 'should return a stream', ->
      expect(stream().filterBy(stream())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = stream()
      expect(a.filterBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).filterBy(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(stream().filterBy(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should end when secondary ends if last value from it was falsy', ->
      a = stream()
      b = stream()
      expect(a.filterBy(b)).toEmit ['<end>'], ->
        send(b, [false, '<end>'])

    it 'should not end when secondary ends if last value from it wasn\'t falsy', ->
      a = stream()
      b = stream()
      expect(a.filterBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = stream()
      expect(a.filterBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should filter values as expected', ->
      a = stream()
      b = stream()
      expect(a.filterBy(b)).toEmit [3, 4, 7, 8, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])


  describe 'stream, property', ->

    it 'should return a stream', ->
      expect(stream().filterBy(prop())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = prop()
      expect(a.filterBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).filterBy(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(stream().filterBy(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has falsy current', ->
      expect(stream().filterBy(send(prop(), [false, '<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended but has truthy current', ->
      expect(stream().filterBy(send(prop(), [true, '<end>']))).toEmit []

    it 'should end when secondary ends if last value from it was falsy', ->
      a = stream()
      b = prop()
      expect(a.filterBy(b)).toEmit ['<end>'], ->
        send(b, [false, '<end>'])

    it 'should not end when secondary ends if last value from it wasn\'t falsy', ->
      a = stream()
      b = prop()
      expect(a.filterBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = prop()
      expect(a.filterBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should filter values as expected', ->
      a = stream()
      b = prop()
      expect(a.filterBy(b)).toEmit [3, 4, 7, 8, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])


  describe 'property, stream', ->

    it 'should return a property', ->
      expect(prop().filterBy(stream())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = stream()
      expect(a.filterBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).filterBy(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(prop().filterBy(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should end when secondary ends if last value from it was falsy', ->
      a = prop()
      b = stream()
      expect(a.filterBy(b)).toEmit ['<end>'], ->
        send(b, [false, '<end>'])

    it 'should not end when secondary ends if last value from it wasn\'t falsy', ->
      a = prop()
      b = stream()
      expect(a.filterBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = stream()
      expect(a.filterBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should filter values as expected', ->
      a = send(prop(), [0])
      b = stream()
      expect(a.filterBy(b)).toEmit [3, 4, 7, 8, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])

  describe 'property, property', ->

    it 'should return a property', ->
      expect(prop().filterBy(prop())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = prop()
      expect(a.filterBy(b)).toActivate(a, b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).filterBy(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(prop().filterBy(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has falsy current', ->
      expect(prop().filterBy(send(prop(), [false, '<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended but has truthy current', ->
      expect(prop().filterBy(send(prop(), [true, '<end>']))).toEmit []

    it 'should end when secondary ends if last value from it was falsy', ->
      a = prop()
      b = prop()
      expect(a.filterBy(b)).toEmit ['<end>'], ->
        send(b, [false, '<end>'])

    it 'should not end when secondary ends if last value from it wasn\'t falsy', ->
      a = prop()
      b = prop()
      expect(a.filterBy(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = prop()
      expect(a.filterBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should filter values as expected', ->
      a = send(prop(), [0])
      b = send(prop(), [true])
      expect(a.filterBy(b)).toEmit [{current: 0}, 3, 4, 7, 8, '<end>'], ->
        send(a, [3, 4])
        send(b, [0])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])
