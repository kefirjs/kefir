const {activate, deactivate, Kefir, value, end, expect} = require('../test-helpers')

describe('fromCallback', () => {
  it('should return stream', () => {
    expect(Kefir.fromCallback(() => {})).to.be.observable.stream()
  })

  it('should not be ended', () => {
    expect(Kefir.fromCallback(() => {})).to.emit([])
  })

  it('should call `callbackConsumer` on first activation, and only on first', () => {
    let count = 0
    const s = Kefir.fromCallback(() => count++)
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
    expect(Kefir.fromCallback(_cb => (cb = _cb))).to.emit([value(1), end()], () => cb(1))
  })

  it('should work after deactivation/activate cicle', () => {
    let cb = null
    const s = Kefir.fromCallback(_cb => (cb = _cb))
    activate(s)
    deactivate(s)
    activate(s)
    deactivate(s)
    expect(s).to.emit([value(1), end()], () => cb(1))
  })

  it('should emit a current, if `callback` is called immediately in `callbackConsumer`', () => {
    expect(Kefir.fromCallback(cb => cb(1))).to.emit([value(1, {current: true}), end({current: true})])
  })
})
