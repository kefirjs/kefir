{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'withHandler', ->


  mirror = (emitter, event) ->
    if event.type == 'value'
      emitter.emit(event.value)
    else
      emitter.end()

  duplicate = (emitter, event) ->
    if event.type == 'value'
      emitter.emit(event.value)
      if !event.current
        emitter.emit(event.value)
    else
      emitter.end()

  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().withHandler ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.withHandler ->).toActivate(a)

    it 'should not be ended if source was ended (by default)', ->
      expect(send(stream(), ['<end>']).withHandler ->).toEmit []

    it 'should be ended if source was ended (with `mirror` handler)', ->
      expect(send(stream(), ['<end>']).withHandler mirror).toEmit ['<end:current>']

    it 'should handle events (with `duplicate` handler)', ->
      a = stream()
      expect(a.withHandler duplicate).toEmit [1, 1, 2, 2, '<end>'], ->
        send(a, [1, 2, '<end>'])

    it 'should automatically preserve isCurent (end)', ->
      a = stream()
      expect(a.withHandler mirror).toEmit ['<end>'], ->
        send(a, ['<end>'])
      expect(a.withHandler mirror).toEmit ['<end:current>']



  describe 'property', ->

    it 'should return property', ->
      expect(prop().withHandler ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.withHandler ->).toActivate(a)

    it 'should not be ended if source was ended (by default)', ->
      expect(send(prop(), ['<end>']).withHandler ->).toEmit []

    it 'should be ended if source was ended (with `mirror` handler)', ->
      expect(send(prop(), ['<end>']).withHandler mirror).toEmit ['<end:current>']

    it 'should handle events and current (with `duplicate` handler)', ->
      a = send(prop(), [1])
      expect(a.withHandler duplicate).toEmit [{current: 1}, 2, 2, 3, 3, '<end>'], ->
        send(a, [2, 3, '<end>'])

    it 'should automatically preserve isCurent (end)', ->
      a = prop()
      expect(a.withHandler mirror).toEmit ['<end>'], ->
        send(a, ['<end>'])
      expect(a.withHandler mirror).toEmit ['<end:current>']

    it 'should automatically preserve isCurent (value)', ->
      a = prop()
      expect(a.withHandler mirror).toEmit [1], ->
        send(a, [1])
      expect(a.withHandler mirror).toEmit [{current: 1}]

      savedEmitter = null
      expect(
        a.withHandler (emitter, event) ->
          mirror(emitter, event)
          savedEmitter = emitter
      ).toEmit [{current: 1}, 2], ->
        savedEmitter.emit(2)


