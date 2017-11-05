const {stream, prop, send, value, error, end, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('sampledBy', () => {
  it('should return stream', () => {
    expect(prop().sampledBy(stream())).to.be.observable.stream()
    expect(stream().sampledBy(prop())).to.be.observable.stream()
  })

  it('should be ended if array of ended observables provided', () => {
    const a = send(stream(), [end()])
    expect(prop().sampledBy(a)).to.emit([end({current: true})])
  })

  it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', () => {
    const a = send(prop(), [value(1), end()])
    const b = send(prop(), [value(2), end()])
    const s2 = a.sampledBy(b)
    expect(s2).to.emit([value(1, {current: true}), end({current: true})])
    expect(s2).to.emit([end({current: true})])
  })

  it('should activate sources', () => {
    const a = stream()
    const b = prop()
    expect(a.sampledBy(b)).to.activate(a, b)
  })

  it('should handle events and current from observables', () => {
    const a = stream()
    const b = send(prop(), [value(0)])
    expect(a.sampledBy(b)).to.emit([value(2), value(4), value(4), end()], () => {
      send(b, [value(1)])
      send(a, [value(2)])
      send(b, [value(3)])
      send(a, [value(4)])
      send(b, [value(5), value(6), end()])
    })
  })

  it('should accept optional combinator function', () => {
    const join = (...args) => args.join('+')
    const a = stream()
    const b = send(prop(), [value(0)])
    expect(a.sampledBy(b, join)).to.emit([value('2+3'), value('4+5'), value('4+6'), end()], () => {
      send(b, [value(1)])
      send(a, [value(2)])
      send(b, [value(3)])
      send(a, [value(4)])
      send(b, [value(5), value(6), end()])
    })
  })

  it('one sampledBy should remove listeners of another', () => {
    const a = send(prop(), [value(0)])
    const b = stream()
    const s1 = a.sampledBy(b)
    const s2 = a.sampledBy(b)
    activate(s1)
    activate(s2)
    deactivate(s2)
    expect(s1).to.emit([value(0)], () => send(b, [value(1)]))
  })

  // https://github.com/rpominov/kefir/issues/98
  it('should work nice for emitating atomic updates', () => {
    const a = stream()
    const b = a.map(x => x + 2)
    const c = a.map(x => x * 2)
    expect(b.sampledBy(c, (x, y) => [x, y])).to.emit([value([3, 2]), value([4, 4]), value([5, 6])], () =>
      send(a, [value(1), value(2), value(3)])
    )
  })
})
