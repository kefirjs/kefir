{stream, prop, send, Kefir, deactivate, activate} = require('../test-helpers.coffee')



describe 'skipWhileBy', ->

  describe 'stream, stream', ->

    it 'should return a stream', ->
      expect(stream().skipWhileBy(stream())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = stream()
      expect(a.skipWhileBy(b)).toActivate(a, b)

    it 'should not activate secondary after first falsey value from it', ->
      a = stream()
      b = stream()
      res = a.waitFor(b)
      activate(res)
      send(b, [true, false])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).skipWhileBy(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(stream().skipWhileBy(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should end when secondary ends if only value from it was truthy', ->
      a = stream()
      b = stream()
      expect(a.skipWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = stream()
      expect(a.skipWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should skip values as expected', ->
      a = stream()
      b = stream()
      expect(a.skipWhileBy(b)).toEmit [7, 8, 9, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9, '<end>'])


  describe 'stream, property', ->

    it 'should return a stream', ->
      expect(stream().skipWhileBy(prop())).toBeStream()

    it 'should activate/deactivate sources', ->
      a = stream()
      b = prop()
      expect(a.skipWhileBy(b)).toActivate(a, b)

    it 'should not activate secondary after first falsey value from it', ->
      a = stream()
      b = prop()
      res = a.waitFor(b)
      activate(res)
      send(b, [true, false])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(stream(), ['<end>']).skipWhileBy(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(stream().skipWhileBy(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has truthy current', ->
      expect(stream().skipWhileBy(send(prop(), [true, '<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended but has falsey current', ->
      expect(stream().skipWhileBy(send(prop(), [false, '<end>']))).toEmit []

    it 'should end when secondary ends if only value from it was truthy', ->
      a = stream()
      b = prop()
      expect(a.skipWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = stream()
      b = prop()
      expect(a.skipWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should skip values as expected', ->
      a = stream()
      b = prop()
      expect(a.skipWhileBy(b)).toEmit [7, 8, 9, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9, '<end>'])


  describe 'property, stream', ->

    it 'should return a property', ->
      expect(prop().skipWhileBy(stream())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = stream()
      expect(a.skipWhileBy(b)).toActivate(a, b)

    it 'should not activate secondary after first falsey value from it', ->
      a = prop()
      b = stream()
      res = a.waitFor(b)
      activate(res)
      send(b, [true, false])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).skipWhileBy(stream())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended', ->
      expect(prop().skipWhileBy(send(stream(), ['<end>']))).toEmit ['<end:current>']

    it 'should end when secondary ends if only value from it was truthy', ->
      a = prop()
      b = stream()
      expect(a.skipWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = stream()
      expect(a.skipWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should skip values as expected', ->
      a = send(prop(), [0])
      b = stream()
      expect(a.skipWhileBy(b)).toEmit [7, 8, 9, '<end>'], ->
        send(b, [true])
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9, '<end>'])

  describe 'property, property', ->

    it 'should return a property', ->
      expect(prop().skipWhileBy(prop())).toBeProperty()

    it 'should activate/deactivate sources', ->
      a = prop()
      b = prop()
      expect(a.skipWhileBy(b)).toActivate(a, b)

    it 'should not activate secondary after first falsey value from it', ->
      a = prop()
      b = prop()
      res = a.waitFor(b)
      activate(res)
      send(b, [true, false])
      deactivate(res)
      expect(res).toActivate(a)
      expect(res).not.toActivate(b)

    it 'should be ended if primary was ended', ->
      expect(send(prop(), ['<end>']).skipWhileBy(prop())).toEmit ['<end:current>']

    it 'should be ended if secondary was ended and has no current', ->
      expect(prop().skipWhileBy(send(prop(), ['<end>']))).toEmit ['<end:current>']

    it 'should not be ended if secondary was ended and has falsey current', ->
      expect(prop().skipWhileBy(send(prop(), [false, '<end>']))).toEmit []

    it 'should be ended if secondary was ended but has truthy current', ->
      expect(prop().skipWhileBy(send(prop(), [true, '<end>']))).toEmit ['<end:current>']

    it 'should end when secondary ends if only value from it was truthy', ->
      a = prop()
      b = prop()
      expect(a.skipWhileBy(b)).toEmit ['<end>'], ->
        send(b, [true, '<end>'])

    it 'should ignore values from primary until first value from secondary', ->
      a = prop()
      b = prop()
      expect(a.skipWhileBy(b)).toEmit [], ->
        send(a, [1, 2])

    it 'should skip values as expected', ->
      a = send(prop(), [0])
      b = send(prop(), [true])
      expect(a.skipWhileBy(b)).toEmit [7, 8, 9, '<end>'], ->
        send(a, [3, 4])
        send(b, [1])
        send(a, [5, 6])
        send(b, [false])
        send(a, [7, 8])
        send(b, [true])
        send(a, [9, '<end>'])
