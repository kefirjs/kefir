const {stream, prop, send, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('repeat', () => {
  it('should return stream', () => {
    expect(Kefir.repeat()).to.be.observable.stream()
  })

  it('should work correctly (with .constant)', () => {
    const a = Kefir.repeat(i => Kefir[i === 2 ? 'constantError' : 'constant'](i))
    expect(a.take(3)).to.emit([{current: 0}, {current: 1}, {currentError: 2}, {current: 3}, '<end:current>'])
  })

  it('should work correctly (with .later)', () => {
    const a = Kefir.repeat(i => Kefir.later(100, i))
    expect(a.take(3)).to.emitInTime([[100, 0], [200, 1], [300, 2], [300, '<end>']])
  })

  it('should work correctly (with .sequentially)', () => {
    const a = Kefir.repeat(i => Kefir.sequentially(100, [1, 2, 3]))
    expect(a.take(5)).to.emitInTime([[100, 1], [200, 2], [300, 3], [400, 1], [500, 2], [500, '<end>']])
  })

  it('should not cause stack overflow', () => {
    const sum = (a, b) => a + b
    const genConstant = () => Kefir.constant(1)

    const a = Kefir.repeat(genConstant).take(3000).scan(sum, 0).last()
    expect(a).to.emit([{current: 3000}, '<end:current>'])
  })

  it('should get new source only if previous one ended', () => {
    let a = stream()

    let callsCount = 0
    const b = Kefir.repeat(() => {
      callsCount++
      if (!a._alive) {
        a = stream()
      }
      return a
    })

    expect(callsCount).to.equal(0)
    activate(b)
    expect(callsCount).to.equal(1)
    deactivate(b)
    activate(b)
    expect(callsCount).to.equal(1)
    send(a, ['<end>'])
    expect(callsCount).to.equal(2)
  })

  it('should unsubscribe from source', () => {
    const a = stream()
    const b = Kefir.repeat(() => a)
    expect(b).to.activate(a)
  })

  it('should end when falsy value returned from generator', () => {
    const a = Kefir.repeat(i => {
      if (i < 3) {
        return Kefir.constant(i)
      } else {
        return false
      }
    })
    expect(a).to.emit([{current: 0}, {current: 1}, {current: 2}, '<end:current>'])
  })
})
