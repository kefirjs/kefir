const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

const handler = x => ({
  convert: x < 0,
  error: x * 3,
})

describe('valuesToErrors', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().valuesToErrors(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.valuesToErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(stream(), [end()]).valuesToErrors(() => {})).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = stream()
      expect(a.valuesToErrors(handler)).to.emit([value(1), error(-6), error(-3), error(-12), value(5), end()], () =>
        send(a, [value(1), value(-2), error(-3), value(-4), value(5), end()])
      )
    })

    it('default handler should convert all values', () => {
      const a = stream()
      expect(a.valuesToErrors()).to.emit([error(1), error(-2), error(-3), error(-4), error(5), end()], () =>
        send(a, [value(1), value(-2), error(-3), value(-4), value(5), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().valuesToErrors(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.valuesToErrors(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () =>
      expect(send(prop(), [end()]).valuesToErrors(() => {})).to.emit([end({current: true})]))

    it('should handle events', () => {
      const a = send(prop(), [value(1)])
      expect(a.valuesToErrors(handler)).to.emit(
        [value(1, {current: true}), error(-6), error(-3), error(-12), value(5), end()],
        () => send(a, [value(-2), error(-3), value(-4), value(5), end()])
      )
    })

    it('should handle currents', () => {
      let a = send(prop(), [value(2)])
      expect(a.valuesToErrors(handler)).to.emit([value(2, {current: true})])
      a = send(prop(), [value(-2)])
      expect(a.valuesToErrors(handler)).to.emit([error(-6, {current: true})])
      a = send(prop(), [error(-2)])
      expect(a.valuesToErrors(handler)).to.emit([error(-2, {current: true})])
    })
  })
})
