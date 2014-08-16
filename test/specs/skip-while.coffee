Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send} = helpers

describe 'skipWhile', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().skipWhile(-> false)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.skipWhile(-> false)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).skipWhile(-> false)).toEmit ['<end:current>']

    it 'should handle events (`-> true`)', ->
      a = stream()
      expect(a.skipWhile(-> true)).toEmit ['<end>'], ->
        send(a, [1, 2, '<end>'])

    it 'should handle events (`-> false`)', ->
      a = stream()
      expect(a.skipWhile(-> false)).toEmit [1, 2, 3, '<end>'], ->
        send(a, [1, 2, 3, '<end>'])

    it 'should handle events (`(x) -> x < 3`)', ->
      a = stream()
      expect(a.skipWhile((x) -> x < 3)).toEmit [3, 4, 5, '<end>'], ->
        send(a, [1, 2, 3, 4, 5, '<end>'])





  describe 'property', ->

    it 'should return property', ->
      expect(prop().skipWhile(-> false)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.skipWhile(-> false)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).skipWhile(-> false)).toEmit ['<end:current>']

    it 'should handle events and current (`-> true`)', ->
      a = send(prop(), [1])
      expect(a.skipWhile(-> true)).toEmit ['<end>'], ->
        send(a, [2, '<end>'])

    it 'should handle events and current (`-> false`)', ->
      a = send(prop(), [1])
      expect(a.skipWhile(-> false)).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [2, 3, '<end>'])

    it 'should handle events and current (`(x) -> x < 3`)', ->
      a = send(prop(), [1])
      expect(a.skipWhile((x) -> x < 3)).toEmit [3, 4, 5, '<end>'], ->
        send(a, [2, 3, 4, 5, '<end>'])
