const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

describe('last', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().last()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.last()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).last()).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.last()).to.emit([error(5), error(6), value(3), end()], () =>
        send(a, [value(1), error(5), error(6), value(2), value(3), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().last()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.last()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).last()).to.emit([end({current: true})])
      expect(send(prop(), [value(1), end()]).last()).to.emit([value(1, {current: true}), end({current: true})])
    })

    it('should handle events and current', () => {
      let a = send(prop(), [value(1)])
      expect(a.last()).to.emit([error(5), value(1), end()], () => send(a, [error(5), end()]))

      a = send(prop(), [error(0)])
      expect(a.last()).to.emit([error(0, {current: true}), error(5), value(3), end()], () =>
        send(a, [value(2), error(5), value(3), end()])
      )
    })
  })
})
