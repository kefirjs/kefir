const {activate, deactivate, Kefir} = require('../test-helpers')

describe('fromEvents', () => {
  const domTarget = () => ({
    addEventListener(name, fn) {
      return (this[name + 'Listener'] = fn)
    },

    removeEventListener(name, fn) {
      if (this[name + 'Listener'] === fn) {
        return delete this[name + 'Listener']
      }
    },
  })

  const nodeTarget = () => ({
    addListener(name, fn) {
      return (this[name + 'Listener'] = fn)
    },

    removeListener(name, fn) {
      if (this[name + 'Listener'] === fn) {
        return delete this[name + 'Listener']
      }
    },
  })

  const onOffTarget = () => ({
    on(name, fn) {
      return (this[name + 'Listener'] = fn)
    },

    off(name, fn) {
      if (this[name + 'Listener'] === fn) {
        return delete this[name + 'Listener']
      }
    },
  })

  it('should return stream', () => {
    expect(Kefir.fromEvents(domTarget(), 'foo')).toBeStream()
  })

  it('should not be ended', () => {
    expect(Kefir.fromEvents(domTarget(), 'foo')).toEmit([])
  })

  it('should subscribe/unsubscribe from target', () => {
    let target = domTarget()
    let a = Kefir.fromEvents(target, 'foo')
    expect(target.fooListener).toBeUndefined()
    activate(a)
    expect(target.fooListener).toEqual(jasmine.any(Function))
    deactivate(a)
    expect(target.fooListener).toBeUndefined()

    target = onOffTarget()
    a = Kefir.fromEvents(target, 'foo')
    expect(target.fooListener).toBeUndefined()
    activate(a)
    expect(target.fooListener).toEqual(jasmine.any(Function))
    deactivate(a)
    expect(target.fooListener).toBeUndefined()

    target = nodeTarget()
    a = Kefir.fromEvents(target, 'foo')
    expect(target.fooListener).toBeUndefined()
    activate(a)
    expect(target.fooListener).toEqual(jasmine.any(Function))
    deactivate(a)
    expect(target.fooListener).toBeUndefined()
  })

  it('should emit values', () => {
    let target = domTarget()
    let a = Kefir.fromEvents(target, 'foo')
    expect(a).toEmit([1, 2, 3], () => {
      target.fooListener(1)
      target.fooListener(2)
      return target.fooListener(3)
    })

    target = nodeTarget()
    a = Kefir.fromEvents(target, 'foo')
    expect(a).toEmit([1, 2, 3], () => {
      target.fooListener(1)
      target.fooListener(2)
      return target.fooListener(3)
    })

    target = onOffTarget()
    a = Kefir.fromEvents(target, 'foo')
    expect(a).toEmit([1, 2, 3], () => {
      target.fooListener(1)
      target.fooListener(2)
      return target.fooListener(3)
    })
  })

  it('should accept optional transformer and call it properly', () => {
    const target = domTarget()
    const a = Kefir.fromEvents(target, 'foo', function(a, b) {
      return [this, a, b]
    })
    expect(a).toEmit([[{a: 1}, undefined, undefined], [{b: 1}, 1, undefined], [{c: 1}, 1, 2]], () => {
      target.fooListener.call({a: 1})
      target.fooListener.call({b: 1}, 1)
      return target.fooListener.call({c: 1}, 1, 2)
    })
  })

  it('the callback passed to the target should always retrun undefined (no transformer)', () => {
    let cb = null
    const target = {
      on(e, x) {
        return (cb = x)
      },
      off(e, x) {
        return (cb = null)
      },
    }
    const a = Kefir.fromEvents(target, 'foo')
    a.take(2).onValue(() => {})
    expect(cb(1)).toEqual(undefined)
    expect(cb(2)).toEqual(undefined)
    expect(cb).toEqual(null)
  })

  it('the callback passed to the target should always retrun undefined (with transformer)', () => {
    let cb = null
    const target = {
      on(e, x) {
        return (cb = x)
      },
      off(e, x) {
        return (cb = null)
      },
    }
    const a = Kefir.fromEvents(target, 'foo', x => x)
    a.take(2).onValue(() => {})
    expect(cb(1)).toEqual(undefined)
    expect(cb(2)).toEqual(undefined)
    expect(cb).toEqual(null)
  })
})
