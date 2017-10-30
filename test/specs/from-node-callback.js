const {activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('fromNodeCallback', () => {
  it('should return stream', () => {
    expect(Kefir.fromNodeCallback(() => {})).to.be.observable.stream()
  })

  it('should not be ended', () => {
    expect(Kefir.fromNodeCallback(() => {})).to.emit([])
  })

  it('should call `callbackConsumer` on first activation, and only on first', () => {
    let count = 0
    const s = Kefir.fromNodeCallback(() => count++)
    expect(count).to.equal(0)
    activate(s)
    expect(count).to.equal(1)
    deactivate(s)
    activate(s)
    deactivate(s)
    activate(s)
    expect(count).to.equal(1)
  })

  it('should emit first result and end after that', () => {
    let cb = null
    expect(Kefir.fromNodeCallback(_cb => cb = _cb)).to.emit([1, '<end>'], () => cb(null, 1))
  })

  it('should emit first error and end after that', () => {
    let cb = null
    expect(Kefir.fromNodeCallback(_cb => cb = _cb)).to.emit([{error: -1}, '<end>'], () => cb(-1))
  })

  it('should work after deactivation/activate cicle', () => {
    let cb = null
    const s = Kefir.fromNodeCallback(_cb => cb = _cb)
    activate(s)
    deactivate(s)
    activate(s)
    deactivate(s)
    expect(s).to.emit([1, '<end>'], () => cb(null, 1))
  })

  it('should emit a current, if `callback` is called immediately in `callbackConsumer`', () => {
    expect(Kefir.fromNodeCallback(cb => cb(null, 1))).to.emit([{current: 1}, '<end:current>'])

    expect(Kefir.fromNodeCallback(cb => cb(-1))).to.emit([{currentError: -1}, '<end:current>'])
  })
})
