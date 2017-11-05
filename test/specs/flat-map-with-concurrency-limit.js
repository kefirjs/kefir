const {stream, prop, send, value, error, end, activate, deactivate, expect} = require('../test-helpers')

describe('flatMapConcurLimit', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().flatMapConcurLimit(null, 1)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.flatMapConcurLimit(null, 1)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).flatMapConcurLimit(null, 1)).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      const b = stream()
      const c = stream()
      const d = stream()
      expect(a.flatMapConcurLimit(null, 2)).to.emit([value(1), value(2), value(4), value(5), value(6), end()], () => {
        send(b, [value(0)])
        send(a, [value(b)])
        send(b, [value(1)])
        send(a, [value(c), value(d), end()])
        send(c, [value(2)])
        send(d, [value(3)])
        send(b, [value(4), end()])
        send(d, [value(5), end()])
        send(c, [value(6), end()])
      })
    })

    it('should activate sub-sources', () => {
      const a = stream()
      const b = stream()
      const c = stream()
      const d = stream()
      const map = a.flatMapConcurLimit(null, 2)
      activate(map)
      send(a, [value(b), value(c), value(d)])
      deactivate(map)
      expect(map).to.activate(b, c)
      expect(map).not.to.activate(d)
      send(b, [end()])
      expect(map).to.activate(d)
    })

    it('should accept optional map fn', () => {
      const a = stream()
      const b = stream()
      expect(a.flatMapConcurLimit(x => x.obs, 1)).to.emit([value(1), value(2), end()], () => {
        send(b, [value(0)])
        send(a, [value({obs: b}), end()])
        send(b, [value(1), value(2), end()])
      })
    })

    it('should correctly handle current values of sub sources on activation', () => {
      const a = stream()
      const b = send(prop(), [value(1)])
      const c = send(prop(), [value(2)])
      const d = send(prop(), [value(3)])
      const m = a.flatMapConcurLimit(null, 2)
      activate(m)
      send(a, [value(b), value(c), value(d)])
      deactivate(m)
      expect(m).to.emit([value(1, {current: true}), value(2, {current: true})])
    })

    it('should correctly handle current values of new sub sources', () => {
      const a = stream()
      const b = send(prop(), [value(1), end()])
      const c = send(prop(), [value(2)])
      const d = send(prop(), [value(3)])
      const e = send(prop(), [value(4)])
      expect(a.flatMapConcurLimit(null, 2)).to.emit([value(4), value(1), value(2)], () =>
        send(a, [value(e), value(b), value(c), value(d)])
      )
    })

    it('limit = 0', () => {
      const a = stream()
      expect(a.flatMapConcurLimit(null, 0)).to.emit([end({current: true})])
    })

    it('limit = -1', () => {
      const a = stream()
      const b = stream()
      const c = stream()
      const d = stream()
      expect(a.flatMapConcurLimit(null, -1)).to.emit(
        [value(1), value(2), value(3), value(4), value(5), value(6), end()],
        () => {
          send(b, [value(0)])
          send(a, [value(b)])
          send(b, [value(1)])
          send(a, [value(c), value(d), end()])
          send(c, [value(2)])
          send(d, [value(3)])
          send(b, [value(4), end()])
          send(d, [value(5), end()])
          send(c, [value(6), end()])
        }
      )
    })

    it('limit = -2', () => {
      // same as -1
      const a = stream()
      const b = stream()
      const c = stream()
      const d = stream()
      expect(a.flatMapConcurLimit(null, -2)).to.emit(
        [value(1), value(2), value(3), value(4), value(5), value(6), end()],
        () => {
          send(b, [value(0)])
          send(a, [value(b)])
          send(b, [value(1)])
          send(a, [value(c), value(d), end()])
          send(c, [value(2)])
          send(d, [value(3)])
          send(b, [value(4), end()])
          send(d, [value(5), end()])
          send(c, [value(6), end()])
        }
      )
    })
  })

  describe('property', () => {
    it('should return stream', () => {
      expect(prop().flatMapConcurLimit(null, 1)).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.flatMapConcurLimit(null, 1)).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).flatMapConcurLimit(null, 1)).to.emit([end({current: true})]))

    it('should be ended if source was ended (with value)', () =>
      expect(send(prop(), [value(send(prop(), [value(0), end()])), end()]).flatMapConcurLimit(null, 1)).to.emit([
        value(0, {current: true}),
        end({current: true}),
      ]))

    it('should correctly handle current value of source', () => {
      const a = send(prop(), [value(0)])
      const b = send(prop(), [value(a)])
      expect(b.flatMapConcurLimit(null, 1)).to.emit([value(0, {current: true})])
    })
  })
})
