const {Kefir, stream, prop, send, value, end, expect} = require('../test-helpers')

describe('beforeEnd', () => {
  beforeEach(() => {
    Kefir.clearActiveObservables()
  })

  afterEach(() => {
    if (Kefir.activeObservables.length !== 0) {
      console.error(`There are ${activeObservables.length} observables that haven't been unsubscribed.`)
    }
  })

  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().beforeEnd(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.beforeEnd(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).beforeEnd(() => 42)).to.emit([value(42, {current: true}), end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.beforeEnd(() => 42)).to.emit([value(1), value(2), value(42), end()], () =>
        send(a, [value(1), value(2), end()])
      )
    })

    it('errors should flow', () => {
      const a = stream()
      expect(a.beforeEnd(() => {})).to.flowErrors(a)
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().beforeEnd(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.beforeEnd(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).beforeEnd(() => 42)).to.emit([value(42, {current: true}), end({current: true})])
      expect(send(prop(), [value(1), end()]).beforeEnd(() => 42)).to.emit([
        value(42, {current: true}),
        end({current: true}),
      ])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [value(1)])
      expect(a.beforeEnd(() => 42)).to.emit([value(1, {current: true}), value(2), value(3), value(42), end()], () =>
        send(a, [value(2), value(3), end()])
      )
    })

    it('errors should flow', () => {
      const a = prop()
      expect(a.beforeEnd(() => {})).to.flowErrors(a)
    })
  })
})
