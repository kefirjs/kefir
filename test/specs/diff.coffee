Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send} = helpers

describe 'diff', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().diff 0, ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.diff 0, ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).diff 0, ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.diff 0, (prev, next) -> prev - next).toEmit [-1, -2, '<end>'], ->
        send(a, [1, 3, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().diff 0, ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.diff 0, ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).diff 0, ->).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.diff 0, (prev, next) -> prev - next).toEmit [{current: -1}, -2, -3, '<end>'], ->
        send(a, [3, 6, '<end>'])


