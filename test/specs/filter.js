const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

describe('filter', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().filter(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.filter(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).filter(() => {})).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.filter(x => x > 3)).to.emit([value(4), value(5), error(7), value(6), end()], () =>
        send(a, [value(1), value(2), value(4), value(5), value(0), error(7), value(6), end()])
      )
    })

    it('shoud use id as default predicate', () => {
      const a = stream()
      expect(a.filter()).to.emit([value(4), value(5), error(7), value(6), end()], () =>
        send(a, [value(0), value(0), value(4), value(5), value(0), error(7), value(6), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().filter(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.filter(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).filter(() => {})).to.emit([end({current: true})])
    })

    it('should handle events and current', () => {
      let a = send(prop(), [value(5)])
      expect(a.filter(x => x > 2)).to.emit([value(5, {current: true}), value(4), error(7), value(3), end()], () =>
        send(a, [value(4), error(7), value(3), value(2), value(1), end()])
      )
      a = send(prop(), [error(0)])
      expect(a.filter(x => x > 2)).to.emit([error(0, {current: true}), value(4), error(7), value(3), end()], () =>
        send(a, [value(4), error(7), value(3), value(2), value(1), end()])
      )
    })

    it('should handle current (not pass)', () => {
      const a = send(prop(), [value(1), error(0)])
      expect(a.filter(x => x > 2)).to.emit([error(0, {current: true})])
    })

    it('shoud use id as default predicate', () => {
      let a = send(prop(), [value(0)])
      expect(a.filter()).to.emit([value(4), error(-value(2)), value(5), value(6), end()], () =>
        send(a, [value(0), value(4), error(-value(2)), value(5), value(0), value(6), end()])
      )
      a = send(prop(), [value(1)])
      expect(a.filter()).to.emit(
        [value(1, {current: true}), value(4), error(-value(2)), value(5), value(6), end()],
        () => send(a, [value(0), value(4), error(-value(2)), value(5), value(0), value(6), end()])
      )
    })
  })
})
