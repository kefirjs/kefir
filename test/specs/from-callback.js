const {activate, deactivate, Kefir} = require('../test-helpers')

describe('fromCallback', () => {
  it('should return stream', () => {
    expect(Kefir.fromCallback(() => {})).toBeStream()
  })

  it('should not be ended', () => {
    expect(Kefir.fromCallback(() => {})).toEmit([])
  })

  it('should call `callbackConsumer` on first activation, and only on first', () => {
    let count = 0
    const s = Kefir.fromCallback(() => count++)
    expect(count).toBe(0)
    activate(s)
    expect(count).toBe(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    expect(count).toBe(1)
  })

  it('should emit first result and end after that', () => {
    let cb = null
    expect(Kefir.fromCallback(_cb => cb = _cb)).toEmit([1, '<end>'], () => cb(1))
  })

  it('should work after deactivation/activate cicle', () => {
    let cb = null
    const s = Kefir.fromCallback(_cb => cb = _cb)
    activate(s)
    deactivate(s)
    activate(s)
    deactivate(s)
    expect(s).toEmit([1, '<end>'], () => cb(1))
  })

  it('should emit a current, if `callback` is called immediately in `callbackConsumer`', () => {
    expect(Kefir.fromCallback(cb => cb(1))).toEmit([{current: 1}, '<end:current>'])
  })
})
