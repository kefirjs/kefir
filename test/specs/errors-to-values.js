const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

const handler = x => ({
  convert: x >= 0,
  value: x * 3,
})

describe('errorsToValues', () => {
  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().errorsToValues(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.errorsToValues(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).errorsToValues(() => {})).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = stream()
      expect(a.errorsToValues(handler)).to.emit([value(1), value(6), error(-1), value(9), value(4), end()], () =>
        send(a, [value(1), error(2), error(-1), error(3), value(4), end()])
      )
    })

    it('default handler should convert all errors', () => {
      const a = stream()
      expect(a.errorsToValues()).to.emit([value(1), value(2), value(-1), value(3), value(4), end()], () =>
        send(a, [value(1), error(2), error(-1), error(3), value(4), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().errorsToValues(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.errorsToValues(() => {})).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).errorsToValues(() => {})).to.emit([end({current: true})])
    })

    it('should handle events', () => {
      const a = send(prop(), [value(1)])
      expect(a.errorsToValues(handler)).to.emit(
        [value(1, {current: true}), value(6), error(-1), value(9), value(4), end()],
        () => send(a, [error(2), error(-1), error(3), value(4), end()])
      )
    })

    it('should handle currents', () => {
      let a = send(prop(), [error(-2)])
      expect(a.errorsToValues(handler)).to.emit([error(-2, {current: true})])
      a = send(prop(), [error(2)])
      expect(a.errorsToValues(handler)).to.emit([value(6, {current: true})])
      a = send(prop(), [value(1)])
      expect(a.errorsToValues(handler)).to.emit([value(1, {current: true})])
    })
  })
})
