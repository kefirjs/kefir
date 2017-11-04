const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

describe('mapErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().mapErrors(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.mapErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).mapErrors(() => {})).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      expect(a.mapErrors(x => x * 2)).to.emit([value(1), error(-2), value(2), error(-4), end()], () =>
        send(a, [value(1), error(-1, {current: true}), value(2), error(-2), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().mapErrors(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.mapErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).mapErrors(() => {})).to.emit([end({current: true})]))

    it('should handle events and current', () => {
      let a = send(prop(), [value(1)])
      expect(a.mapErrors(x => x * 2)).to.emit(
        [value(1, {current: true}), value(2), error(-4), value(3), error(-6), end()],
        () => send(a, [value(2), error(-2), value(3), error(-3), end()])
      )
      a = send(prop(), [error(-1, {current: true})])
      expect(a.mapErrors(x => x * 2)).to.emit(
        [error(-2, {current: true}), value(2), error(-4), value(3), error(-6), end()],
        () => send(a, [value(2), error(-2), value(3), error(-3), end()])
      )
    })
  })
})
