Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send} = helpers

describe 'skipDuplicates', ->


  roundlyEqual = (a, b) ->
    Math.round(a) == Math.round(b)

  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().skipDuplicates()).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.skipDuplicates()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).skipDuplicates()).toEmit ['<end:current>']

    it 'should handle events (default comparator)', ->
      a = stream()
      expect(a.skipDuplicates()).toEmit [1, 2, 3, '<end>'], ->
        send(a, [1, 1, 2, 3, 3, '<end>'])

    it 'should handle events (custom comparator)', ->
      a = stream()
      expect(a.skipDuplicates roundlyEqual).toEmit [1, 2, 3.8, '<end>'], ->
        send(a, [1, 1.1, 2, 3.8, 4, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().skipDuplicates()).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.skipDuplicates()).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).skipDuplicates()).toEmit ['<end:current>']

    it 'should handle events and current (default comparator)', ->
      a = send(prop(), [1])
      expect(a.skipDuplicates()).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [1, 1, 2, 3, 3, '<end>'])

    it 'should handle events and current (custom comparator)', ->
      a = send(prop(), [1])
      expect(a.skipDuplicates roundlyEqual).toEmit [{current: 1}, 2, 3, '<end>'], ->
        send(a, [1.1, 1.2, 2, 3, 3.2, '<end>'])


