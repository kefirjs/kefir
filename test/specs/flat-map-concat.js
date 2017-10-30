const {stream, prop, send, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('flatMapConcat', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMapConcat()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMapConcat()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).flatMapConcat()).to.emit(['<end:current>']))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = stream()
      expect(a.flatMapConcat()).to.emit([1, 2, 5, 6, '<end>'], () => {
        send(b, [0])
        send(a, [b])
        send(b, [1, 2])
        send(a, [c, '<end>'])
        send(c, [4])
        send(b, [5, '<end>'])
        send(c, [6, '<end>'])
      })
    })

    it('should activate sub-sources', () => {
      const a = stream()
      const b = stream()
      const c = send(prop(), [0])
      const map = a.flatMapConcat()
      activate(map)
      send(a, [b, c])
      deactivate(map)
      expect(map).to.activate(b)
      expect(map).not.to.activate(c)
      send(b, ['<end>'])
      expect(map).to.activate(c)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMapConcat(x => x.obs)).to.emit([1, 2, '<end>'], () => {
        send(b, [0])
        send(a, [{obs: b}, '<end>'])
        send(b, [1, 2, '<end>'])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [1])
      const m = a.flatMapConcat()
      activate(m)
      send(a, [b])
      deactivate(m)
      expect(m).to.emit([{current: 1}])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [1, '<end>'])
      const c = send(prop(), [2])
      const d = send(prop(), [3])
      expect(a.flatMapConcat()).to.emit([1, 2], () => send(a, [b, c, d]))
    })

    it('should work nicely with Kefir.constant and Kefir.never', () => {
      const a = stream()
      expect(
        a.flatMapConcat(x => {
          if (x > 2) {
            return Kefir.constant(x)
          } else {
            return Kefir.never()
          }
        })
      ).to.emit([3, 4, 5], () => send(a, [1, 2, 3, 4, 5]))
    })
  })

  describe('property', () => {
    it('should return stream', () => {
      expect(prop().flatMapConcat()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.flatMapConcat()).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).flatMapConcat()).to.emit(['<end:current>']))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapConcat()).to.emit([
        {current: 0},
        '<end:current>',
      ]))

    it('should correctly handle current value of source', () => {
      const a = send(prop(), [0])
      const b = send(prop(), [a])
      expect(b.flatMapConcat()).to.emit([{current: 0}])
    })
  })
})
