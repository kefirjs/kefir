const {stream, prop, send} = require('../test-helpers')

describe('filterErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().filterErrors(() => {})).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.filterErrors(() => {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).filterErrors(() => {})).toEmit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      expect(a.filterErrors(x => x > 3)).toEmit([-1, {error: 4}, -2, {error: 5}, {error: 6}, '<end>'], () =>
        send(a, [-1, {error: 1}, {error: 2}, {error: 3}, {error: 4}, -2, {error: 5}, {error: 0}, {error: 6}, '<end>'])
      )
    })

    it('shoud use id as default predicate', () => {
      const a = stream()
      expect(a.filterErrors()).toEmit([-1, {error: 4}, -2, {error: 5}, false, {error: 6}, '<end>'], () =>
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

  describe('property', () => {
    it('should return property', () => {
      expect(prop().filterErrors(() => {})).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.filterErrors(() => {})).toActivate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).filterErrors(() => {})).toEmit(['<end:current>']))

    it('should handle events and current', () => {
      const a = send(prop(), [{error: 5}])
      expect(a.filterErrors(x => x > 3)).toEmit([{currentError: 5}, {error: 4}, -2, {error: 6}, '<end>'], () =>
        send(a, [{error: 1}, {error: 2}, {error: 3}, {error: 4}, -2, {error: 0}, {error: 6}, '<end>'])
      )
    })

    it('should handle current (not pass)', () => {
      const a = send(prop(), [{error: 0}])
      expect(a.filterErrors(x => x > 2)).toEmit([])
    })

    it('shoud use id as default predicate', () => {
      let a = send(prop(), [{error: 5}])
      expect(a.filterErrors()).toEmit([{currentError: 5}, {error: 4}, -2, {error: 6}, '<end>'], () =>
        send(a, [{error: 0}, {error: false}, {error: null}, {error: 4}, -2, {error: undefined}, {error: 6}, '<end>'])
      )
      a = send(prop(), [{error: 0}])
      expect(a.filterErrors()).toEmit([])
    })
  })
})
