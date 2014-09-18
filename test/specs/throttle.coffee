{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'throttle', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().throttle(100)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.throttle(100)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).throttle(100)).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.throttle(100)).toEmitInTime(
        [[ 0, 1 ], [ 100, 4 ], [ 200, 5 ], [ 320, 6 ], [ 520, 7 ], [ 620, 9 ], [ 620, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )

    it 'should handle events {trailing: false}', ->
      a = stream()
      expect(a.throttle(100, {trailing: false})).toEmitInTime(
        [[ 0, 1 ], [ 120, 5 ], [ 320, 6 ], [ 520, 7 ], [ 610, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )

    it 'should handle events {leading: false}', ->
      a = stream()
      expect(a.throttle(100, {leading: false})).toEmitInTime(
        [[ 100, 4 ], [ 220, 5 ], [ 420, 6 ], [ 620, 9 ], [ 620, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )

    it 'should handle events {leading: false, trailing: false}', ->
      a = stream()
      expect(a.throttle(100, {leading: false, trailing: false})).toEmitInTime(
        [[ 120, 5 ], [ 320, 6 ], [ 520, 7 ], [ 610, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )



  describe 'property', ->

    it 'should return property', ->
      expect(prop().throttle(100)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.throttle(100)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).throttle(100)).toEmit ['<end:current>']

    it 'should handle events', ->
      a = send(prop(), [0])
      expect(a.throttle(100)).toEmitInTime(
        [[0, {current: 0}], [ 0, 1 ], [ 100, 4 ], [ 200, 5 ], [ 320, 6 ], [ 520, 7 ], [ 620, 9 ], [ 620, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )

    it 'should handle events {trailing: false}', ->
      a = send(prop(), [0])
      expect(a.throttle(100, {trailing: false})).toEmitInTime(
        [[0, {current: 0}], [ 0, 1 ], [ 120, 5 ], [ 320, 6 ], [ 520, 7 ], [ 610, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )

    it 'should handle events {leading: false}', ->
      a = send(prop(), [0])
      expect(a.throttle(100, {leading: false})).toEmitInTime(
        [[0, {current: 0}], [ 100, 4 ], [ 220, 5 ], [ 420, 6 ], [ 620, 9 ], [ 620, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )

    it 'should handle events {leading: false, trailing: false}', ->
      a = send(prop(), [0])
      expect(a.throttle(100, {leading: false, trailing: false})).toEmitInTime(
        [[0, {current: 0}], [ 120, 5 ], [ 320, 6 ], [ 520, 7 ], [ 610, '<end>' ]],
        (tick) ->
          send(a, [1])
          tick(30); send(a, [2])
          tick(30); send(a, [3])
          tick(30); send(a, [4])
          tick(30); send(a, [5])
          tick(200); send(a, [6])
          tick(200); send(a, [7])
          tick(30); send(a, [8])
          tick(30); send(a, [9])
          tick(30); send(a, ['<end>'])
      )
