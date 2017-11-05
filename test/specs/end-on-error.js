const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

describe('endOnError', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().endOnError()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.endOnError()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).endOnError()).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      let a = stream()
      expect(a.endOnError()).to.emit([value(1), error(5), end()], () => send(a, [value(1), error(5), value(2)]))
      a = stream()
      expect(a.endOnError()).to.emit([value(1), value(2), end()], () => send(a, [value(1), value(2), end()]))
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().endOnError()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.endOnError()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).endOnError()).to.emit([end({current: true})])
    })

    it('should handle events and current', () => {
      let a = send(prop(), [value(1)])
      expect(a.endOnError()).to.emit([value(1, {current: true}), error(5), end()], () => send(a, [error(5), value(2)]))
      a = send(prop(), [value(1)])
      expect(a.endOnError()).to.emit([value(1, {current: true}), value(2), end()], () => send(a, [value(2), end()]))
    })

    it('should handle currents', () => {
      let a = send(prop(), [error(-1, {current: true})])
      expect(a.endOnError()).to.emit([error(-1, {current: true}), end({current: true})])
      a = send(prop(), [error(-1, {current: true}), end()])
      expect(a.endOnError()).to.emit([error(-1, {current: true}), end({current: true})])
      a = send(prop(), [value(1)])
      expect(a.endOnError()).to.emit([value(1, {current: true})])
      a = send(prop(), [value(1), end()])
      expect(a.endOnError()).to.emit([value(1, {current: true}), end({current: true})])
    })
  })
})
