const {activate, deactivate, value, error, end, Kefir, expect} = require('../test-helpers')

describe('Kefir.stream', () => {
  it('should return stream', () => {
    expect(Kefir.stream(() => {})).to.be.observable.stream()
  })

  it('should not be ended', () => {
    expect(Kefir.stream(() => {})).to.emit([])
  })

  it('should emit values, errors, and end', () => {
    let emitter = null
    const a = Kefir.stream(em => {
      emitter = em
      return null
    })
    expect(a).to.emit([value(1), value(2), error(-1), value(3), end()], () => {
      emitter.value(1)
      emitter.value(2)
      emitter.error(-1)
      emitter.value(3)
      return emitter.end()
    })
  })

  it('should call `subscribe` / `unsubscribe` on activation / deactivation', () => {
    let subCount = 0
    let unsubCount = 0
    const a = Kefir.stream(() => {
      subCount++
      return () => unsubCount++
    })
    expect(subCount).to.equal(0)
    expect(unsubCount).to.equal(0)
    activate(a)
    expect(subCount).to.equal(1)
    activate(a)
    expect(subCount).to.equal(1)
    deactivate(a)
    expect(unsubCount).to.equal(0)
    deactivate(a)
    expect(unsubCount).to.equal(1)
    expect(subCount).to.equal(1)
    activate(a)
    expect(subCount).to.equal(2)
    expect(unsubCount).to.equal(1)
    deactivate(a)
    expect(unsubCount).to.equal(2)
  })

  it('should automatically controll isCurent argument in `send`', () => {
    expect(
      Kefir.stream(emitter => {
        emitter.end()
        return null
      })
    ).to.emit([end({current: true})])

    expect(
      Kefir.stream(emitter => {
        emitter.value(1)
        emitter.error(-1)
        emitter.value(2)
        setTimeout(() => {
          emitter.value(2)
          return emitter.end()
        }, 1000)
        return null
      })
    ).to.emitInTime([
      [0, value(1, {current: true})],
      [0, error(-1, {current: true})],
      [0, value(2, {current: true})],
      [1000, value(2)],
      [1000, end()],
    ])
  })

  it('should support emitter.event', () => {
    expect(
      Kefir.stream(emitter => {
        emitter.event({type: 'value', value: 1, current: true})
        emitter.event({type: 'error', value: -1, current: false})
        emitter.event({type: 'value', value: 2, current: false})
        setTimeout(() => {
          emitter.event({type: 'value', value: 3, current: true})
          emitter.event({type: 'value', value: 4, current: false})
          return emitter.event({
            type: 'end',
            value: undefined,
            current: false,
          })
        }, 1000)
        return null
      })
    ).to.emitInTime([
      [0, value(1, {current: true})],
      [0, error(-1, {current: true})],
      [0, value(2, {current: true})],
      [1000, value(3)],
      [1000, value(4)],
      [1000, end()],
    ])
  })

  // https://github.com/kefirjs/kefir/issues/35
  it('should work with .take(1) and sync emit', () => {
    const log = []

    const a = Kefir.stream(emitter => {
      const logRecord = {sub: 1, unsub: 0}
      log.push(logRecord)
      emitter.value(1)
      return () => logRecord.unsub++
    })

    a.take(1).onValue(() => {})
    a.take(1).onValue(() => {})

    expect(log).to.deep.equal([
      {sub: 1, unsub: 1},
      {sub: 1, unsub: 1},
    ])
  })

  it('should not throw if not falsey but not a function returned', () => {
    expect(Kefir.stream(() => true)).to.emit([])
  })

  it('emitter should return a boolean representing if anyone intrested in future events', () => {
    let emitter = null
    let a = Kefir.stream(em => (emitter = em))
    activate(a)
    expect(emitter.value(1)).to.equal(true)
    deactivate(a)
    expect(emitter.value(1)).to.equal(false)

    a = Kefir.stream(em => {
      expect(em.value(1)).to.equal(true)
      expect(em.value(2)).to.equal(false)
      expect(em.value(3)).to.equal(false)
    })
    let lastX = null
    var f = x => {
      lastX = x
      if (x === 2) {
        return a.offValue(f)
      }
    }
    a.onValue(f)
    expect(lastX).to.equal(2)
  })

  it('calling emitter.end() in undubscribe() should work fine', () => {
    let em = null
    const s = Kefir.stream(_em => {
      em = _em
      return () => em.end()
    })
    s.onValue(() => {})
    em.value(1)
    return em.end()
  })
})
