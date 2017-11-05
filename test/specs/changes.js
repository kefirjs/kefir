const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

const streamWithCurrent = event => Kefir.stream(emitter => emitter.emitEvent(event))

describe('changes', () => {
  describe('stream', () => {
    it('should stream', () => {
      expect(stream().changes()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.changes()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(stream(), [end()]).changes()).to.emit([end({current: true})])
    })

    it('test `streamWithCurrent` helper', () => {
      expect(streamWithCurrent({type: 'value', value: 1})).to.emit([value(1, {current: true})])
      expect(streamWithCurrent({type: 'error', value: 1})).to.emit([error(1, {current: true})])
    })

    it('should handle events and current', () => {
      let a = streamWithCurrent({type: 'value', value: 1})
      expect(a.changes()).to.emit([value(value(2)), error(5), value(value(3)), end()], () =>
        send(a, [value(value(2)), error(5), value(value(3)), end()])
      )
      a = streamWithCurrent({type: 'error', value: 1})
      expect(a.changes()).to.emit([value(2), error(5), value(3), end()], () =>
        send(a, [value(2), error(5), value(3), end()])
      )
    })
  })

  describe('property', () => {
    it('should stream', () => {
      expect(prop().changes()).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.changes()).to.activate(a)
    })

    it('should be ended if source was ended', () => {
      expect(send(prop(), [end()]).changes()).to.emit([end({current: true})])
    })

    it('should handle events and current', () => {
      const a = send(prop(), [value(1), error(4)])
      expect(a.changes()).to.emit([value(2), error(5), value(3), end()], () =>
        send(a, [value(2), error(5), value(3), end()])
      )
    })
  })
})
