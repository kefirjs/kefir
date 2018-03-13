const {stream, prop, send, value, error, end, Kefir, expect} = require('../test-helpers')

describe('withHandler', () => {
  const mirror = (emitter, event) => {
    switch (event.type) {
      case 'value':
        return emitter.emit(event.value)
      case 'error':
        return emitter.error(event.value)
      case 'end':
        return emitter.end()
    }
  }

  const emitEventMirror = (emitter, event) => emitter.emitEvent(event)

  const duplicate = (emitter, event) => {
    if (event.type === 'value') {
      emitter.emit(event.value)
      if (!event.current) {
        return emitter.emit(event.value)
      }
    } else if (event.type === 'error') {
      emitter.error(event.value)
      if (!event.current) {
        return emitter.error(event.value)
      }
    } else {
      return emitter.end()
    }
  }

  describe('stream', () => {
    it('should return stream', () => {
      expect(stream().withHandler(() => {})).to.be.observable.stream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.withHandler(() => {})).to.activate(a)
    })

    it('should not be ended if source was ended (by default)', () =>
      expect(send(stream(), [end()]).withHandler(() => {})).to.emit([]))

    it('should be ended if source was ended (with `mirror` handler)', () =>
      expect(send(stream(), [end()]).withHandler(mirror)).to.emit([end({current: true})]))

    it('should handle events (with `duplicate` handler)', () => {
      const a = stream()
      expect(a.withHandler(duplicate)).to.emit(
        [value(1), value(1), error(3), error(3), value(2), value(2), end()],
        () => send(a, [value(1), error(3), value(2), end()])
      )
    })

    it('should automatically preserve isCurent (end)', () => {
      const a = stream()
      expect(a.withHandler(mirror)).to.emit([end()], () => send(a, [end()]))
      expect(a.withHandler(mirror)).to.emit([end({current: true})])
    })

    it('should support emitter.emitEvent', () => {
      const a = stream()
      expect(a.withHandler(emitEventMirror)).to.emit([value(1), error(3), value(2), end()], () =>
        send(a, [value(1), error(3), value(2), end()])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().withHandler(() => {})).to.be.observable.property()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.withHandler(() => {})).to.activate(a)
    })

    it('should not be ended if source was ended (by default)', () =>
      expect(send(prop(), [end()]).withHandler(() => {})).to.emit([]))

    it('should be ended if source was ended (with `mirror` handler)', () =>
      expect(send(prop(), [end()]).withHandler(mirror)).to.emit([end({current: true})]))

    it('should handle events and current (with `duplicate` handler)', () => {
      let a = send(prop(), [value(1)])
      expect(a.withHandler(duplicate)).to.emit(
        [value(1, {current: true}), value(2), value(2), error(4), error(4), value(3), value(3), end()],
        () => send(a, [value(2), error(4), value(3), end()])
      )
      a = send(prop(), [error(0)])
      expect(a.withHandler(duplicate)).to.emit(
        [error(0, {current: true}), value(2), value(2), error(4), error(4), value(3), value(3), end()],
        () => send(a, [value(2), error(4), value(3), end()])
      )
    })

    it('should support emitter.emitEvent', () => {
      const a = send(prop(), [value(1)])
      expect(a.withHandler(emitEventMirror)).to.emit(
        [value(1, {current: true}), value(2), error(4), value(3), end()],
        () => send(a, [value(2), error(4), value(3), end()])
      )
      expect(send(prop(), [error(-1, {current: true})]).withHandler(emitEventMirror)).to.emit([
        error(-1, {current: true}),
      ])
    })

    it('should automatically preserve isCurent (end)', () => {
      const a = prop()
      expect(a.withHandler(mirror)).to.emit([end()], () => send(a, [end()]))
      expect(a.withHandler(mirror)).to.emit([end({current: true})])
    })

    it('should automatically preserve isCurent (value)', () => {
      const a = prop()
      expect(a.withHandler(mirror)).to.emit([value(1)], () => send(a, [value(1)]))
      expect(a.withHandler(mirror)).to.emit([value(1, {current: true})])

      let savedEmitter = null
      expect(
        a.withHandler((emitter, event) => {
          mirror(emitter, event)
          savedEmitter = emitter
        })
      ).to.emit([value(1, {current: true}), value(2)], () => savedEmitter.value(2))
    })

    it('should automatically preserve isCurent (error)', () => {
      const a = prop()
      expect(a.withHandler(mirror)).to.emit([error(1)], () => send(a, [error(1)]))
      expect(a.withHandler(mirror)).to.emit([error(1, {current: true})])

      let savedEmitter = null
      expect(
        a.withHandler((emitter, event) => {
          mirror(emitter, event)
          return (savedEmitter = emitter)
        })
      ).to.emit([error(1, {current: true}), error(2)], () => savedEmitter.error(2))
    })
  })
})
