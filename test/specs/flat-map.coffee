Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send, activate, deactivate} = helpers

describe 'flatMap', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().flatMap()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.flatMap()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).flatMap()).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      expect(a.flatMap()).toEmit [1, 2, {current: 0}, 3, 4, '<end>'], ->
        send(b, [0])
        send(a, [b])
        send(b, [1, 2])
        send(a, [c, '<end>'])
        send(b, [3, '<end>'])
        send(c, [4, '<end>'])

    it 'should activate sub-sources', ->
      a = stream()
      b = stream()
      c = send(prop(), [0])
      map = a.flatMap()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).toActivate(b, c)


    it 'should accept optional map fn', ->
      a = stream()
      b = stream()
      expect(a.flatMap((x) -> x.obs)).toEmit [1, 2, '<end>'], ->
        send(b, [0])
        send(a, [{obs: b}, '<end>'])
        send(b, [1, 2, '<end>'])



  describe 'property', ->

    it 'should return stream', ->
      expect(prop().flatMap()).toBeStream()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.flatMap()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).flatMap()).toEmit ['<end:current>']

    it 'should handle current value', ->
      a = send(prop(), [0])
      b = send(prop(), [a])
      expect(b.flatMap()).toEmit [{current: 0}]

    it 'should costantly adding current value on each activation (documented bug)', ->
      a = send(prop(), [0])
      b = send(prop(), [a])
      map = b.flatMap()
      activate(map)
      deactivate(map)
      activate(map)
      deactivate(map)
      expect(map).toEmit [{current: 0}, {current: 0}, {current: 0}]


