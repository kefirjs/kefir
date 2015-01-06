{stream, prop, send, Kefir} = require('../test-helpers.coffee')



describe 'filterErrors', ->


  describe 'stream', ->

    it 'should return stream', ->
      expect(stream().filterErrors ->).toBeStream()

    it 'should activate/deactivate source', ->
      a = stream()
      expect(a.filterErrors ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(stream(), ['<end>']).filterErrors ->).toEmit ['<end:current>']

    it 'should handle events', ->
      a = stream()
      expect(a.filterErrors (x) -> x > 3).toEmit [
        -1
        {error: 4}
        -2
        {error: 5}
        {error: 6}
        '<end>'
      ], ->
        send(a, [
          -1
          {error: 1}
          {error: 2}
          {error: 3}
          {error: 4}
          -2
          {error: 5}
          {error: 0}
          {error: 6}
          '<end>'
        ])

    it 'shoud use id as default predicate', ->
      a = stream()
      expect(a.filterErrors()).toEmit [
        -1
        {error: 4}
        -2
        {error: 5}
        false
        {error: 6}
        '<end>'
      ], ->
        send(a, [
          -1
          {error: 0}
          {error: false}
          {error: null}
          {error: 4}
          -2
          {error: 5}
          {error: ''}
          false
          {error: 6}
          '<end>'
        ])


  describe 'property', ->

    it 'should return property', ->
      expect(prop().filterErrors ->).toBeProperty()

    it 'should activate/deactivate source', ->
      a = prop()
      expect(a.filterErrors ->).toActivate(a)

    it 'should be ended if source was ended', ->
      expect(send(prop(), ['<end>']).filterErrors ->).toEmit ['<end:current>']

    it 'should handle events and current', ->
      a = send(prop(), [-1, {error: 5}])
      expect(a.filterErrors (x) -> x > 3).toEmit [
        {current: -1}
        {currentError: 5}
        {error: 4}
        -2
        {error: 6}
        '<end>'
      ], ->
        send(a, [
          {error: 1}
          {error: 2}
          {error: 3}
          {error: 4}
          -2
          {error: 0}
          {error: 6}
          '<end>'
        ])

    it 'should handle current (not pass)', ->
      a = send(prop(), [1, {error: 0}])
      expect(a.filterErrors (x) -> x > 2).toEmit [{current: 1}]

    it 'shoud use id as default predicate', ->
      a = send(prop(), [-1, {error: 5}])
      expect(a.filterErrors()).toEmit [
        {current: -1}
        {currentError: 5}
        {error: 4}
        -2
        {error: 6}
        '<end>'
      ], ->
        send(a, [
          {error: 0}
          {error: false}
          {error: null}
          {error: 4}
          -2
          {error: undefined}
          {error: 6}
          '<end>'
        ])
      a = send(prop(), [1, {error: 0}])
      expect(a.filterErrors()).toEmit [{current: 1}]
