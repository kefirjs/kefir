Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send} = helpers

describe 'take', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().take(3)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.take(3)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).take(3)).toEmit ['<end:current>']

    it 'should be ended if `n` is 0', ->
      expect(stream().take(0)).toEmit ['<end:current>']

    it 'should handle events (less than `n`)', ->
      a = stream()
      expect(a.take(3)).toEmit [1, 2, '<end>'], ->
        send(a, [1, 2, '<end>'])

    it 'should handle events (more than `n`)', ->
      a = stream()
      expect(a.take(3)).toEmit [1, 2, 3, '<end>'], ->
        send(a, [1, 2, 3, 4, 5, '<end>'])




  describe 'property', ->

    it 'should return property', ->
      expect(prop().take(3)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.take(3)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).take(3)).toEmit ['<end:current>']

    it 'should be ended if `n` is 0', ->
      expect(prop().take(0)).toEmit ['<end:current>']

    it 'should handle events and current (less than `n`)', ->
      a = send(prop(), [1])
      expect(a.take(3)).toEmit [{current: 1}, 2, '<end>'], ->
        send(a, [2, '<end>'])

    it 'should handle events and current (more than `n`)', ->
      a = send(prop(), [1])
      expect(a.take(3)).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [2, 3, 4, 5, '<end>'])




