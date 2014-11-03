{stream, prop, send, Kefir, activate, deactivate} = require('../test-helpers.coffee')



describe 'waitFor', ->

  describe 'stream, stream', ->

    it 'should return a stream', ->
      expect(stream().waitFor(stream())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = stream()
      expect(a.waitFor(b)).toActivate(a, b)

    it 'should not activate secondary after first value from it', ->
      a = stream()
      b = stream()
      res = a.waitFor(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).waitFor(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(stream().waitFor(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should not end when secondary ends if it produced at least one value', ->
      a = stream()
      b = stream()
      expect(a.waitFor(b)).toEmit [], ->
        send(b, [0, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = stream()
      expect(a.waitFor(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should emit all values from primary after first value from secondary', ->
      a = stream()
      b = stream()
      expect(a.waitFor(b)).toEmit [3, 4, 5, 6, 7, 8, 9, '<end>'], ->
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
      expect(stream().waitFor(prop())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = prop()
      expect(a.waitFor(b)).toActivate(a, b)

    it 'should not activate secondary after first value from it', ->
      a = stream()
      b = prop()
      res = a.waitFor(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).waitFor(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(stream().waitFor(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended but has any current', ->
      expect(stream().waitFor(send(prop(), [0, '<end>']))).toEmit []

    it 'should not end when secondary ends if it produced at least one value', ->
      a = stream()
      b = prop()
      expect(a.waitFor(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = prop()
      expect(a.waitFor(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should filter values as expected', ->
      a = stream()
      b = send(prop(), [0])
      expect(a.waitFor(b)).toEmit [3, 4, 5, 6, 7, 8, 9, '<end>'], ->
        send(a, [3, 4])
        send(b, [2])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])


  describe 'property, stream', ->

    it 'should return a property', ->
      expect(prop().waitFor(stream())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = stream()
      expect(a.waitFor(b)).toActivate(a, b)

    it 'should not activate secondary after first value from it', ->
      a = prop()
      b = stream()
      res = a.waitFor(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).waitFor(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(prop().waitFor(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should not end when secondary ends if it produced at least one value', ->
      a = prop()
      b = stream()
      expect(a.waitFor(b)).toEmit [], ->
        send(b, [0, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = stream()
      expect(a.waitFor(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should filter values as expected', ->
      a = send(prop(), [0])
      b = stream()
      expect(a.waitFor(b)).toEmit [3, 4, 5, 6, 7, 8, 9, '<end>'], ->
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
      expect(prop().waitFor(prop())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = prop()
      expect(a.waitFor(b)).toActivate(a, b)

    it 'should not activate secondary after first value from it', ->
      a = prop()
      b = prop()
      res = a.waitFor(b)
      activate(res)
      send(b, [1])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).waitFor(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(prop().waitFor(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended but has any current', ->
      expect(prop().waitFor(send(prop(), [0, '<end>']))).toEmit []

    it 'should not end when secondary ends if it produced at least one value', ->
      a = prop()
      b = prop()
      expect(a.waitFor(b)).toEmit [], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = prop()
      expect(a.waitFor(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should filter values as expected', ->
      a = send(prop(), [0])
      b = send(prop(), [0])
      expect(a.waitFor(b)).toEmit [{current: 0}, 3, 4, 5, 6, 7, 8, 9, '<end>'], ->
        send(a, [3, 4])
        send(b, [2])
        send(a, [5, 6])
        send(b, [1])
        send(a, [7, 8])
        send(b, [false])
        send(a, [9, '<end>'])
