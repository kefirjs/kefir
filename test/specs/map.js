const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

describe('map', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().map(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.map(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).map(() => {})).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      expect(a.map(x => x * 2)).to.emit([value(2), error(5), value(4), end()], () =>
        send(a, [value(1), error(5), value(2), end()])
      )
    })

    it('should work with default `fn`', () => {
      const a = stream()
      expect(a.map()).to.emit([value(1), error(5), value(2), end()], () =>
        send(a, [value(1), error(5), value(2), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().map(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.map(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).map(() => {})).to.emit([end({current: true})]))

    it('should handle events and current', () => {
      let a = send(prop(), [value(1)])
      expect(a.map(x => x * 2)).to.emit([value(2, {current: true}), value(4), error(5), value(6), end()], () =>
        send(a, [value(2), error(5), value(3), end()])
      )
      a = send(prop(), [error(0)])
      expect(a.map(x => x * 2)).to.emit([error(0, {current: true}), value(4), error(5), value(6), end()], () =>
        send(a, [value(2), error(5), value(3), end()])
      )
    })
  })
})
