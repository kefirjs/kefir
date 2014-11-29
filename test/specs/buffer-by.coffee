{stream, prop, send, Kefir, deactivate, activate} = require('../test-helpers.coffee')



describe 'bufferBy', ->

  describe 'common', ->

    it 'should activate/deactivate sources', ->
      a = stream()
      b = stream()
      expect(a.bufferBy(b)).toActivate(a, b)
      a = stream()
      b = prop()
      expect(a.bufferBy(b)).toActivate(a, b)
      a = prop()
      b = stream()
      expect(a.bufferBy(b)).toActivate(a, b)
      a = prop()
      b = prop()
      expect(a.bufferBy(b)).toActivate(a, b)

    it 'should end when primary ends', ->
      expect(send(stream(), ['<end>']).bufferBy(stream())).toEmit ['<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferBy(b)).toEmit ['<end>'], -> send(a, ['<end>'])

    it 'should flush buffer on end', ->
      expect(send(prop(), [1, '<end>']).bufferBy(stream())).toEmit [{current: [1]}, '<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferBy(b)).toEmit [[1, 2], '<end>'], -> send(a, [1, 2, '<end>'])

    it 'should not flush buffer on end if {flushOnEnd: false}', ->
      expect(send(prop(), [1, '<end>']).bufferBy(stream(), {flushOnEnd: false})).toEmit ['<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferBy(b, {flushOnEnd: false})).toEmit ['<end>'], -> send(a, [1, 2, '<end>'])

    it 'should not end when secondary ends', ->
      expect(stream().bufferBy(send(stream(), ['<end>']))).toEmit []
      a = stream()
      b = stream()
      expect(a.bufferBy(b)).toEmit [], -> send(b, ['<end>'])

    it 'should do end when secondary ends if {flushOnEnd: false}', ->
      expect(stream().bufferBy(send(stream(), ['<end>']), {flushOnEnd: false})).toEmit ['<end:current>']
      a = stream()
      b = stream()
      expect(a.bufferBy(b, {flushOnEnd: false})).toEmit ['<end>'], -> send(b, ['<end>'])

    it 'should flush buffer (if not empty) on each value from secondary', ->
      a = stream()
      b = stream()
      expect(a.bufferBy(b)).toEmit [[1, 2], [3]], ->
        send(b, [0])
        send(a, [1, 2])
        send(b, [0])
        send(b, [0])
        send(a, [3])
        send(b, [0])
        send(a, [4])



  describe 'stream + stream', ->

    it 'returns stream', ->
      expect(stream().bufferBy(stream())).toBeStream()



  describe 'stream + property', ->

    it 'returns stream', ->
      expect(stream().bufferBy(prop())).toBeStream()



  describe 'property + stream', ->

    it 'returns property', ->
      expect(prop().bufferBy(stream())).toBeProperty()

    it 'includes current to buffer', ->
      a = send(prop(), [1])
      b = stream()
      expect(a.bufferBy(b)).toEmit [[1]], ->
        send(b, [0])



  describe 'property + property', ->

    it 'returns property', ->
      expect(prop().bufferBy(prop())).toBeProperty()

    it 'both have current', ->
      a = send(prop(), [1])
      b = send(prop(), [2])
      expect(a.bufferBy(b)).toEmit [{current: [1]}]

