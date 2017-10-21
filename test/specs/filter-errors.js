/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee')

describe('filterErrors', function() {
  describe('stream', function() {
    it('should return stream', () => expect(stream().filterErrors(function() {})).toBeStream())

    it('should activate/deactivate source', function() {
      const a = stream()
      return expect(a.filterErrors(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).filterErrors(function() {})).toEmit(['<end:current>']))

    it('should handle events', function() {
      const a = stream()
      return expect(a.filterErrors(x => x > 3)).toEmit([-1, {error: 4}, -2, {error: 5}, {error: 6}, '<end>'], () =>
        send(a, [-1, {error: 1}, {error: 2}, {error: 3}, {error: 4}, -2, {error: 5}, {error: 0}, {error: 6}, '<end>'])
      )
    })

    return it('shoud use id as default predicate', function() {
      const a = stream()
      return expect(a.filterErrors()).toEmit([-1, {error: 4}, -2, {error: 5}, false, {error: 6}, '<end>'], () =>
        send(a, [
          -1,
          {error: 0},
          {error: false},
          {error: null},
          {error: 4},
          -2,
          {error: 5},
          {error: ''},
          false,
          {error: 6},
          '<end>',
        ])
      )
    })
  })

  return describe('property', function() {
    it('should return property', () => expect(prop().filterErrors(function() {})).toBeProperty())

    it('should activate/deactivate source', function() {
      const a = prop()
      return expect(a.filterErrors(function() {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).filterErrors(function() {})).toEmit(['<end:current>']))

    it('should handle events and current', function() {
      const a = send(prop(), [{error: 5}])
      return expect(a.filterErrors(x => x > 3)).toEmit([{currentError: 5}, {error: 4}, -2, {error: 6}, '<end>'], () =>
        send(a, [{error: 1}, {error: 2}, {error: 3}, {error: 4}, -2, {error: 0}, {error: 6}, '<end>'])
      )
    })

    it('should handle current (not pass)', function() {
      const a = send(prop(), [{error: 0}])
      return expect(a.filterErrors(x => x > 2)).toEmit([])
    })

    return it('shoud use id as default predicate', function() {
      let a = send(prop(), [{error: 5}])
      expect(a.filterErrors()).toEmit([{currentError: 5}, {error: 4}, -2, {error: 6}, '<end>'], () =>
        send(a, [{error: 0}, {error: false}, {error: null}, {error: 4}, -2, {error: undefined}, {error: 6}, '<end>'])
      )
      a = send(prop(), [{error: 0}])
      return expect(a.filterErrors()).toEmit([])
    })
  })
})
