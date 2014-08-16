Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{stream, prop, send} = helpers

describe 'scan', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().scan 0, ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.scan 0, ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).scan 0, ->).toEmit [{current: 0}, '<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.scan 0, (prev, next) -> prev - next).toEmit [{current: 0}, -1, -4, '<end>'], ->
        send(a, [1, 3, '<end>'])



  describe 'property', ->

    it 'should return property', ->
      expect(prop().scan 0, ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.scan 0, ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).scan 0, ->).toEmit [{current: 0}, '<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [1])
      expect(a.scan 0, (prev, next) -> prev - next).toEmit [{current: -1}, -4, -10, '<end>'], ->
        send(a, [3, 6, '<end>'])


