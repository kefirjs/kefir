{stream, prop, send, Kefir} = require('../test-helpers.coffee')


intv = 300
cnt = 4


describe 'bufferWithTimeOrCount', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().bufferWithTimeOrCount(intv, cnt)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).bufferWithTimeOrCount(intv, cnt)).toEmit ['<end:current>']

    it 'should flush buffer when either interval or count is reached', ->
      a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt)).toEmitInTime(
        [[300, [1, 2, 3]], [500, [4, 5, 6, 7]], [700, [8, 9]], [700, '<end>']],
        (tick) ->
          tick(100); send(a, [1])
          tick(100); send(a, [2])
          tick(99); send(a, [3])
          tick(51); send(a, [4])
          tick(50); send(a, [5])
          tick(50); send(a, [6])
          tick(50); send(a, [7])
          tick(100); send(a, [8])
          tick(100); send(a, [9, '<end>'])
      )

    it 'should not flush buffer on end if {flushOnEnd: false}', ->
      a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).toEmitInTime(
        [[300, [1, 2, 3]],[500, [4, 5, 6, 7]],[700, '<end>']],
        (tick) ->
          tick(100); send(a, [1])
          tick(100); send(a, [2])
          tick(99); send(a, [3])
          tick(51); send(a, [4])
          tick(50); send(a, [5])
          tick(50); send(a, [6])
          tick(50); send(a, [7])
          tick(100); send(a, [8])
          tick(100); send(a, [9, '<end>'])
      )

    it 'errors should flow', ->
      a = stream()
      expect(a.bufferWithTimeOrCount(intv, cnt)).errorsToFlow(a)



  describe 'property', ->

    it 'should return property', ->
      expect(prop().bufferWithTimeOrCount(intv, cnt)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.bufferWithTimeOrCount(intv, cnt)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).bufferWithTimeOrCount(intv, cnt)).toEmit ['<end:current>']
      expect(send(prop(), [1, '<end>']).bufferWithTimeOrCount(intv, cnt)).toEmit [{current: [1]}, '<end:current>']
      expect(send(prop(), [1, '<end>']).bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).toEmit ['<end:current>']

    it 'should flush buffer when either interval or count is reached', ->
      a = send(prop(), [0])
      expect(a.bufferWithTimeOrCount(intv, cnt)).toEmitInTime(
        [[300, [0, 1, 2]],[500, [3, 4, 5, 6]],[700, [7, 8]],[700, '<end>']],
        (tick) ->
          tick(100); send(a, [1])
          tick(100); send(a, [2])
          tick(150); send(a, [3])
          tick(50); send(a, [4])
          tick(50); send(a, [5])
          tick(50); send(a, [6])
          tick(100); send(a, [7])
          tick(100); send(a, [8, '<end>'])
      )

    it 'should not flush buffer on end if {flushOnEnd: false}', ->
      a = send(prop(), [0])
      expect(a.bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).toEmitInTime(
        [[300, [0, 1, 2]],[500, [3, 4, 5, 6]],[700, '<end>']],
        (tick) ->
          tick(100); send(a, [1])
          tick(100); send(a, [2])
          tick(150); send(a, [3])
          tick(50); send(a, [4])
          tick(50); send(a, [5])
          tick(50); send(a, [6])
          tick(100); send(a, [7])
          tick(100); send(a, [8, '<end>'])
      )

    it 'errors should flow', ->
      a = prop()
      expect(a.bufferWithTimeOrCount(intv, cnt)).errorsToFlow(a)
