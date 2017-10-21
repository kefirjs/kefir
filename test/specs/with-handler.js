const {stream, prop, send, Kefir} = require('../test-helpers')

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
      expect(stream().withHandler(() => {})).toBeStream()
    })

    it('should activate/deactivate source', () => {
      const a = stream()
      expect(a.withHandler(() => {})).toActivate(a)
    })

    it('should not be ended if source was ended (by default)', () =>
      expect(send(stream(), ['<end>']).withHandler(() => {})).toEmit([]))

    it('should be ended if source was ended (with `mirror` handler)', () =>
      expect(send(stream(), ['<end>']).withHandler(mirror)).toEmit(['<end:current>']))

    it('should handle events (with `duplicate` handler)', () => {
      const a = stream()
      expect(a.withHandler(duplicate)).toEmit([1, 1, {error: 3}, {error: 3}, 2, 2, '<end>'], () =>
        send(a, [1, {error: 3}, 2, '<end>'])
      )
    })

    it('should automatically preserve isCurent (end)', () => {
      const a = stream()
      expect(a.withHandler(mirror)).toEmit(['<end>'], () => send(a, ['<end>']))
      expect(a.withHandler(mirror)).toEmit(['<end:current>'])
    })

    it('should support emitter.emitEvent', () => {
      const a = stream()
      expect(a.withHandler(emitEventMirror)).toEmit([1, {error: 3}, 2, '<end>'], () =>
        send(a, [1, {error: 3}, 2, '<end>'])
      )
    })
  })

  describe('property', () => {
    it('should return property', () => {
      expect(prop().withHandler(() => {})).toBeProperty()
    })

    it('should activate/deactivate source', () => {
      const a = prop()
      expect(a.withHandler(() => {})).toActivate(a)
    })

    it('should not be ended if source was ended (by default)', () =>
      expect(send(prop(), ['<end>']).withHandler(() => {})).toEmit([]))

    it('should be ended if source was ended (with `mirror` handler)', () =>
      expect(send(prop(), ['<end>']).withHandler(mirror)).toEmit(['<end:current>']))

    it('should handle events and current (with `duplicate` handler)', () => {
      let a = send(prop(), [1])
      expect(a.withHandler(duplicate)).toEmit([{current: 1}, 2, 2, {error: 4}, {error: 4}, 3, 3, '<end>'], () =>
        send(a, [2, {error: 4}, 3, '<end>'])
      )
      a = send(prop(), [{error: 0}])
      expect(a.withHandler(duplicate)).toEmit([{currentError: 0}, 2, 2, {error: 4}, {error: 4}, 3, 3, '<end>'], () =>
        send(a, [2, {error: 4}, 3, '<end>'])
      )
    })

    it('should support emitter.emitEvent', () => {
      const a = send(prop(), [1])
      expect(a.withHandler(emitEventMirror)).toEmit([{current: 1}, 2, {error: 4}, 3, '<end>'], () =>
        send(a, [2, {error: 4}, 3, '<end>'])
      )
      expect(send(prop(), [{error: -1}]).withHandler(emitEventMirror)).toEmit([{currentError: -1}])
    })

    it('should automatically preserve isCurent (end)', () => {
      const a = prop()
      expect(a.withHandler(mirror)).toEmit(['<end>'], () => send(a, ['<end>']))
      expect(a.withHandler(mirror)).toEmit(['<end:current>'])
    })

    it('should automatically preserve isCurent (value)', () => {
      const a = prop()
      expect(a.withHandler(mirror)).toEmit([1], () => send(a, [1]))
      expect(a.withHandler(mirror)).toEmit([{current: 1}])

      let savedEmitter = null
      expect(
        a.withHandler((emitter, event) => {
          mirror(emitter, event)
          return (savedEmitter = emitter)
        })
      ).toEmit([{current: 1}, 2], () => savedEmitter.emit(2))
    })

    it('should automatically preserve isCurent (error)', () => {
      const a = prop()
      expect(a.withHandler(mirror)).toEmit([{error: 1}], () => send(a, [{error: 1}]))
      expect(a.withHandler(mirror)).toEmit([{currentError: 1}])

      let savedEmitter = null
      expect(
        a.withHandler((emitter, event) => {
          mirror(emitter, event)
          return (savedEmitter = emitter)
        })
      ).toEmit([{currentError: 1}, {error: 2}], () => savedEmitter.emit({error: 2}))
    })
  })
})
