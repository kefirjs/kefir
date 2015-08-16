{stream, prop, send, Kefir, deactivate, activate} = require('../test-helpers.coffee')



describe 'bufferWhileBy', ->

  describe 'common', ->

    it 'should activate/deactivate sources', ->
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).toActivate(a, b)
      a = stream()
      b = prop()
      expect(a.bufferWhileBy(b)).toActivate(a, b)
      a = prop()
      b = stream()
      expect(a.bufferWhileBy(b)).toActivate(a, b)
      a = prop()
      b = prop()
      expect(a.bufferWhileBy(b)).toActivate(a, b)

    it 'should end when primary ends (w/o {emitEmpty: true})', ->
      expect(send(stream(), ['<end>']).bufferWhileBy(stream())).toEmit ['<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).toEmit ['<end>'], -> send(a, ['<end>'])

    it 'should flush empty buffer and then end when primary ends (w/ {emitEmpty: true})', ->
      expect(send(stream(), ['<end>']).bufferWhileBy(stream(), {emitEmpty: true})).toEmit [{current: []}, '<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b, {emitEmpty: true})).toEmit [[], '<end>'], -> send(a, ['<end>'])

    it 'should flush empty buffer and then end when secondary ends (w/ {flushOnChange: true, emitEmpty: true})', ->
      expect(stream().bufferWhileBy(send(prop(), [true, false]), {flushOnChange: true, emitEmpty: true})).toEmit [{current: []}]
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b, {flushOnChange: true, emitEmpty: true})).toEmit [[]], -> send(b, [true, false])

    it 'should flush buffer on end', ->
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream())).toEmit [{current: [1]}, '<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).toEmit [[1, 2], '<end>'], -> send(a, [1, 2, '<end>'])

    it 'should not flush buffer on end if {flushOnEnd: false}', ->
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream(), {flushOnEnd: false})).toEmit ['<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit ['<end>'], -> send(a, [1, 2, '<end>'])

    it 'should end when secondary ends, if it haven\'t emitted any value (w/ {flushOnEnd: false})', ->
      expect(stream().bufferWhileBy(send(stream(), ['<end>']), {flushOnEnd: false})).toEmit ['<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit ['<end>'], -> send(b, ['<end>'])

    it 'should end when secondary ends, if its last emitted value was truthy (w/ {flushOnEnd: false})', ->
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']), {flushOnEnd: false})).toEmit ['<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit ['<end>'], -> send(b, [true, '<end>'])

    it 'should not end when secondary ends, if its last emitted value was falsy (w/ {flushOnEnd: false})', ->
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']), {flushOnEnd: false})).toEmit []
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit [], -> send(b, [false, '<end>'])

    it 'should not end when secondary ends (w/o {flushOnEnd: false})', ->
      expect(stream().bufferWhileBy(send(prop(), ['<end>']))).toEmit []
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).toEmit [], -> send(b, ['<end>'])
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']))).toEmit []
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).toEmit [], -> send(b, [true, '<end>'])
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']))).toEmit []
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).toEmit [], -> send(b, [false, '<end>'])

    it 'should flush buffer on each value from primary if last value form secondary was falsy', ->
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).toEmit [[1,2,3,4], [5], [6,7,8]], ->
        send(a, [1, 2]) # buffering
        send(b, [true])
        send(a, [3]) # still buffering
        send(b, [false])
        send(a, [4]) # flushing 1,2,3,4
        send(a, [5]) # flushing 5
        send(b, [true])
        send(a, [6, 7]) # buffering again
        send(b, [false])
        send(a, [8]) # flushing 6,7,8

    it 'errors should flow', ->
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).errorsToFlow(a)
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b)).errorsToFlow(b)
      a = prop()
      b = stream()
      expect(a.bufferWhileBy(b)).errorsToFlow(a)
      a = prop()
      b = stream()
      expect(a.bufferWhileBy(b)).errorsToFlow(b)
      a = stream()
      b = prop()
      expect(a.bufferWhileBy(b)).errorsToFlow(a)
      a = stream()
      b = prop()
      expect(a.bufferWhileBy(b)).errorsToFlow(b)
      a = prop()
      b = prop()
      expect(a.bufferWhileBy(b)).errorsToFlow(a)
      a = prop()
      b = prop()
      expect(a.bufferWhileBy(b)).errorsToFlow(b)

    it 'should flush on change if {flushOnChange === true}', ->
      a = stream()
      b = stream()
      expect(a.bufferWhileBy(b, {flushOnChange: true})).toEmit [[1,2,3]], ->
        send(a, [1, 2]) # buffering
        send(b, [true])
        send(a, [3]) # still buffering
        send(b, [false]) # flush


  describe 'stream + stream', ->

    it 'returns stream', ->
      expect(stream().bufferWhileBy(stream())).toBeStream()



  describe 'stream + property', ->

    it 'returns stream', ->
      expect(stream().bufferWhileBy(prop())).toBeStream()



  describe 'property + stream', ->

    it 'returns property', ->
      expect(prop().bufferWhileBy(stream())).toBeProperty()

    it 'includes current to buffer', ->
      a = send(prop(), [1])
      b = stream()
      expect(a.bufferWhileBy(b)).toEmit [[1, 2]], ->
        send(b, [false])
        send(a, [2])



  describe 'property + property', ->

    it 'returns property', ->
      expect(prop().bufferWhileBy(prop())).toBeProperty()

    it 'both have current', ->
      a = send(prop(), [1])
      b = send(prop(), [false])
      expect(a.bufferWhileBy(b)).toEmit [{current: [1]}]
      a = send(prop(), [1])
      b = send(prop(), [true])
      expect(a.bufferWhileBy(b)).toEmit []
