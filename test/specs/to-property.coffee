{stream, prop, send, Kefir, activate, deactivate} = require('../test-helpers.coffee')



describe 'toProperty', ->


  describe 'stream', ->

    it 'should return property', ->
      expect(stream().toProperty(-> 0)).toBeProperty()
      expect(stream().toProperty()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.toProperty()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).toProperty()).toEmit ['<end:current>']

    it 'should be ended if source was ended (with current)', ->
      expect(send(stream(), ['<end>']).toProperty(-> 0)).toEmit [{current: 0}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      p = a.toProperty(-> 0)
      expect(p).toEmit [{current: 0}, 1, {error: 3}, 2, '<end>'], ->
        send(a, [1, {error: 3}, 2, '<end>'])
      expect(p).toEmit [{current: 2}, '<end:current>']

    it 'should call callback on each activation', ->
      count = 0
      a = stream()
      p = a.toProperty(-> count++)
      activate(p)
      expect(count).toBe(1)
      deactivate(p)
      expect(count).toBe(1)
      activate(p)
      expect(count).toBe(2)

    it 'should reset value by getting new from the callback on each activation', ->
      getCurrent = (p) ->
        result = null
        getter = (x) -> result = x
        p.onValue(getter)
        p.offValue(getter)
        result

      a = stream()
      p = a.toProperty(-> 0)

      expect(getCurrent(p)).toBe(0)
      activate(p)
      send(a, [1])
      expect(getCurrent(p)).toBe(1)
      deactivate(p)
      expect(getCurrent(p)).toBe(0)



  describe 'property', ->

    it 'should return property', ->
      expect(prop().toProperty(-> 0)).toBeProperty()
      expect(prop().toProperty()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.toProperty(-> 0)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).toProperty(-> 0)).toEmit [{current: 0}, '<end:current>']
      expect(send(prop(), [1, '<end>']).toProperty(-> 0)).toEmit [{current: 1}, '<end:current>']

    it 'should handle events', ->
      a = send(prop(), [1])
      b = a.toProperty(-> 0)
      expect(b).toEmit [{current: 1}, 2, {error: 3}, '<end>'], ->
        send(a, [2, {error: 3}, '<end>'])
      expect(b).toEmit [{currentError: 3}, '<end:current>']

      a = prop()
      b = a.toProperty(-> 0)
      expect(b).toEmit [{current: 0}, 2, {error: 3}, 4, '<end>'], ->
        send(a, [2, {error: 3}, 4, '<end>'])
      expect(b).toEmit [{current: 4}, '<end:current>']

    it 'if original property has no current, and .toProperty called with no arguments, then result should have no current', ->
      expect(prop().toProperty()).toEmit []


