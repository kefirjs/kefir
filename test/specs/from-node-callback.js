/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {activate, deactivate, Kefir} = require('../test-helpers')

describe('fromNodeCallback', function() {
  it('should return stream', () => expect(Kefir.fromNodeCallback(function() {})).toBeStream())

  it('should not be ended', () => expect(Kefir.fromNodeCallback(function() {})).toEmit([]))

  it('should call `callbackConsumer` on first activation, and only on first', function() {
    let count = 0
    const s = Kefir.fromNodeCallback(() => count++)
    expect(count).toBe(0)
    activate(s)
    expect(count).toBe(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    return expect(count).toBe(1)
  })

  it('should emit first result and end after that', function() {
    let cb = null
    return expect(Kefir.fromNodeCallback(_cb => cb = _cb)).toEmit([1, '<end>'], () => cb(null, 1))
  })

  it('should emit first error and end after that', function() {
    let cb = null
    return expect(Kefir.fromNodeCallback(_cb => cb = _cb)).toEmit([{error: -1}, '<end>'], () => cb(-1))
  })

  it('should work after deactivation/activate cicle', function() {
    let cb = null
    const s = Kefir.fromNodeCallback(_cb => cb = _cb)
    activate(s)
    deactivate(s)
    activate(s)
    deactivate(s)
    return expect(s).toEmit([1, '<end>'], () => cb(null, 1))
  })

  return it('should emit a current, if `callback` is called immediately in `callbackConsumer`', function() {
    expect(Kefir.fromNodeCallback(cb => cb(null, 1))).toEmit([{current: 1}, '<end:current>'])

    return expect(Kefir.fromNodeCallback(cb => cb(-1))).toEmit([{currentError: -1}, '<end:current>'])
  })
})
