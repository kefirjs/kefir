const {stream, prop, send, value, end, expect} = require('../test-helpers')

describe('ignoreEnd', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().ignoreEnd()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.ignoreEnd()).to.activate(a)
    })

    it('should not be ended if source was ended', () => {
      expect(send(stream(), [end()]).ignoreEnd()).to.emit([])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.ignoreEnd()).to.emit([value(1), value(2)], () => send(a, [value(1), value(2), end()]))
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.ignoreEnd()).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().ignoreEnd()).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.ignoreEnd()).to.activate(a)
    })

    it('should not be ended if source was ended', () => {
      expect(send(prop(), [end()]).ignoreEnd()).to.emit([])
      expect(send(prop(), [value(1), end()]).ignoreEnd()).to.emit([value(1, {current: true})])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [value(1)])
      expect(a.ignoreEnd()).to.emit([value(1, {current: true}), value(2), value(3)], () =>
        send(a, [value(2), value(3), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.ignoreEnd()).to.flowErrors(a)
    })
  })
})
