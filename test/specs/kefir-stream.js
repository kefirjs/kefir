/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {activate, deactivate, Kefir} = require('../test-helpers')

describe('Kefir.stream', function() {
  it('should return stream', () => expect(Kefir.stream(function() {})).toBeStream())

  it('should not be ended', () => expect(Kefir.stream(function() {})).toEmit([]))

  it('should emit values, errors, and end', function() {
    let emitter = null
    const a = Kefir.stream(function(em) {
      emitter = em
      return null
    })
    return expect(a).toEmit([1, 2, {error: -1}, 3, '<end>'], function() {
      emitter.value(1)
      emitter.value(2)
      emitter.error(-1)
      emitter.value(3)
      return emitter.end()
    })
  })

  it('should call `subscribe` / `unsubscribe` on activation / deactivation', function() {
    let subCount = 0
    let unsubCount = 0
    const a = Kefir.stream(function() {
      subCount++
      return () => unsubCount++
    })
    expect(subCount).toBe(0)
    expect(unsubCount).toBe(0)
    activate(a)
    expect(subCount).toBe(1)
    activate(a)
    expect(subCount).toBe(1)
    deactivate(a)
    expect(unsubCount).toBe(0)
    deactivate(a)
    expect(unsubCount).toBe(1)
    expect(subCount).toBe(1)
    activate(a)
    expect(subCount).toBe(2)
    expect(unsubCount).toBe(1)
    deactivate(a)
    return expect(unsubCount).toBe(2)
  })

  it('should automatically controll isCurent argument in `send`', function() {
    expect(
      Kefir.stream(function(emitter) {
        emitter.end()
        return null
      })
    ).toEmit(['<end:current>'])

    return expect(
      Kefir.stream(function(emitter) {
        emitter.value(1)
        emitter.error(-1)
        emitter.value(2)
        setTimeout(function() {
          emitter.value(2)
          return emitter.end()
        }, 1000)
        return null
      })
    ).toEmitInTime([[0, {current: 1}], [0, {currentError: -1}], [0, {current: 2}], [1000, 2], [1000, '<end>']])
  })

  it('should support emitter.event', () =>
    expect(
      Kefir.stream(function(emitter) {
        emitter.event({type: 'value', value: 1, current: true})
        emitter.event({type: 'error', value: -1, current: false})
        emitter.event({type: 'value', value: 2, current: false})
        setTimeout(function() {
          emitter.event({type: 'value', value: 3, current: true})
          emitter.event({type: 'value', value: 4, current: false})
          return emitter.event({type: 'end', value: undefined, current: false})
        }, 1000)
        return null
      })
    ).toEmitInTime([
      [0, {current: 1}],
      [0, {currentError: -1}],
      [0, {current: 2}],
      [1000, 3],
      [1000, 4],
      [1000, '<end>'],
    ]))

  // https://github.com/rpominov/kefir/issues/35
  it('should work with .take(1) and sync emit', function() {
    const log = []

    const a = Kefir.stream(function(emitter) {
      const logRecord = {sub: 1, unsub: 0}
      log.push(logRecord)
      emitter.value(1)
      return () => logRecord.unsub++
    })

    a.take(1).onValue(function() {})
    a.take(1).onValue(function() {})

    return expect(log).toEqual([{sub: 1, unsub: 1}, {sub: 1, unsub: 1}])
  })

  it('should not throw if not falsey but not a function returned', () => expect(Kefir.stream(() => true)).toEmit([]))

  it('emitter should return a boolean representing if anyone intrested in future events', function() {
    let emitter = null
    let a = Kefir.stream(em => emitter = em)
    activate(a)
    expect(emitter.value(1)).toBe(true)
    deactivate(a)
    expect(emitter.value(1)).toBe(false)

    a = Kefir.stream(function(em) {
      expect(em.value(1)).toBe(true)
      expect(em.value(2)).toBe(false)
      return expect(em.value(3)).toBe(false)
    })
    let lastX = null
    var f = function(x) {
      lastX = x
      if (x === 2) {
        return a.offValue(f)
      }
    }
    a.onValue(f)
    return expect(lastX).toBe(2)
  })

  return it('calling emitter.end() in undubscribe() should work fine', function() {
    let em = null
    const s = Kefir.stream(function(_em) {
      em = _em
      return () => em.end()
    })
    s.onValue(function() {})
    em.value(1)
    return em.end()
  })
})
