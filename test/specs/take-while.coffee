Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send} = helpers

describe 'takeWhile', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().takeWhile(-> true)).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.takeWhile(-> true)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).takeWhile(-> true)).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.takeWhile((x) -> x < 4)).toEmit [1, 2, 3, '<end>'], ->
        send(a, [1, 2, 3, 4, 5, '<end>'])

    it 'should handle events (natural end)', ->
      a = stream()
      expect(a.takeWhile((x) -> x < 4)).toEmit [1, 2, '<end>'], ->
        send(a, [1, 2, '<end>'])

    it 'should handle events (with `-> false`)', ->
      a = stream()
      expect(a.takeWhile(-> false)).toEmit ['<end>'], ->
        send(a, [1, 2, '<end>'])




  describe 'property', ->

    it 'should return property', ->
      expect(prop().takeWhile(-> true)).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.takeWhile(-> true)).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).takeWhile(-> true)).toEmit ['<end:current>']

    it 'should be ended if calback was `-> false` and source has a current', ->
      expect(send(prop(), [1]).takeWhile(-> false)).toEmit ['<end:current>']

    it 'should handle events', ->
      a = send(prop(), [1])
      expect(a.takeWhile((x) -> x < 4)).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [2, 3, 4, 5, '<end>'])

    it 'should handle events (natural end)', ->
      a = send(prop(), [1])
      expect(a.takeWhile((x) -> x < 4)).toEmit [{current: 1}, 2, '<end>'], ->
        send(a, [2, '<end>'])

    it 'should handle events (with `-> false`)', ->
      a = prop()
      expect(a.takeWhile(-> false)).toEmit ['<end>'], ->
        send(a, [1, 2, '<end>'])
