const {stream, prop, send, activate, deactivate, Kefir, expect} = require('../test-helpers')

describe('zip', () => {
  it('should return stream', () => {
    expect(Kefir.zip([])).to.be.observable.stream()
    expect(Kefir.zip([stream(), prop()])).to.be.observable.stream()
    expect(stream().zip(stream())).to.be.observable.stream()
    expect(prop().zip(prop())).to.be.observable.stream()
  })

  it('should be ended if empty array provided', () => {
    expect(Kefir.zip([])).to.emit(['<end:current>'])
  })

  it('should be ended if array of ended observables provided', () => {
    const a = send(stream(), ['<end>'])
    const b = send(prop(), ['<end>'])
    const c = send(stream(), ['<end>'])
    expect(Kefir.zip([a, b, c])).to.emit(['<end:current>'])
    expect(a.zip(b)).to.emit(['<end:current>'])
  })

  it('should be ended and has current if array of ended properties provided and each of them has current', () => {
    const a = send(prop(), [1, '<end>'])
    const b = send(prop(), [2, '<end>'])
    const c = send(prop(), [3, '<end>'])
    expect(Kefir.zip([a, b, c])).to.emit([{current: [1, 2, 3]}, '<end:current>'])
    expect(a.zip(b)).to.emit([{current: [1, 2]}, '<end:current>'])
  })

  it('should activate sources', () => {
    const a = stream()
    const b = prop()
    const c = stream()
    expect(Kefir.zip([a, b, c])).to.activate(a, b, c)
    expect(a.zip(b)).to.activate(a, b)
  })

  it('should handle events and current from observables', () => {
    let a = stream()
    let b = send(prop(), [0])
    const c = stream()
    // a   --1---4-------6-7--------X
    // b  0---2------------------9X
    // c   ----3-------5-------8------X
    //     ----•-------•---------•----X
    //   [1,0,3] [4,2,5]   [6,9,8]
    expect(Kefir.zip([a, b, c])).to.emit([[1, 0, 3], [4, 2, 5], [6, 9, 8], '<end>'], () => {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4])
      send(c, [5])
      send(a, [6, 7])
      send(c, [8])
      send(b, [9, '<end>'])
      send(a, ['<end>'])
      send(c, ['<end>'])
    })

    a = stream()
    b = send(prop(), [0])
    expect(a.zip(b)).to.emit([[1, 0], [3, 2], '<end>'], () => {
      send(b, [2])
      send(a, [1, 3, '<end>'])
      send(b, ['<end>'])
    })
  })

  it('should support arrays', () => {
    let a = [1, 4, 6, 7]
    let b = send(prop(), [0])
    const c = stream()
    // a   1, 4, 6, 7
    // b  0---2------------------9X
    // c   ----3-------5-------8------X
    //     ----•-------•---------•----X
    //   [1,0,3] [4,2,5]   [6,9,8]
    expect(Kefir.zip([a, b, c])).to.emit([[1, 0, 3], [4, 2, 5], [6, 9, 8], '<end>'], () => {
      send(b, [2])
      send(c, [3])
      send(c, [5])
      send(c, [8])
      send(b, [9, '<end>'])
      send(c, ['<end>'])
    })

    a = [1, 3]
    b = send(prop(), [0])
    expect(b.zip(a)).to.emit([{current: [0, 1]}, [2, 3], '<end>'], () => {
      send(b, [2])
      send(b, ['<end>'])
    })
  })

  it('should work with arrays only', () => {
    expect(Kefir.zip([[1, 2, 3], [4, 5], [6, 7, 8, 9]])).to.emit([
      {current: [1, 4, 6]},
      {current: [2, 5, 7]},
      '<end:current>',
    ])
  })

  it('should accept optional combinator function', () => {
    const join = (...args) => args.join('+')
    let a = stream()
    let b = send(prop(), [0])
    const c = stream()
    expect(Kefir.zip([a, b, c], join)).to.emit(['1+0+3', '4+2+5', '6+9+8', '<end>'], () => {
      send(a, [1])
      send(b, [2])
      send(c, [3])
      send(a, [4])
      send(c, [5])
      send(a, [6, 7])
      send(c, [8])
      send(b, [9, '<end>'])
      send(a, ['<end>'])
      send(c, ['<end>'])
    })

    a = stream()
    b = send(prop(), [0])
    expect(a.zip(b, join)).to.emit(['1+0', '3+2', '<end>'], () => {
      send(b, [2])
      send(a, [1, 3, '<end>'])
      send(b, ['<end>'])
    })
  })

  it('errors should flow', () => {
    let a = stream()
    let b = prop()
    let c = stream()
    expect(Kefir.zip([a, b, c])).to.flowErrors(a)
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.zip([a, b, c])).to.flowErrors(b)
    a = stream()
    b = prop()
    c = stream()
    expect(Kefir.zip([a, b, c])).to.flowErrors(c)
  })

  it('when activating second time and has 2+ properties in sources, should emit current value at most once', () => {
    const a = send(prop(), [0])
    const b = send(prop(), [1])
    const cb = Kefir.zip([a, b])
    activate(cb)
    deactivate(cb)
    expect(cb).to.emit([{current: [0, 1]}])
  })

  it('should work correctly when unsuscribing after one sync event', () => {
    let c1
    const a0 = stream()
    const a = a0.toProperty(() => 1)
    const b0 = stream()
    const b = b0.toProperty(() => 1)
    const c = Kefir.zip([a, b])

    activate((c1 = c.take(2)))
    send(b0, [1, 1])
    send(a0, [1])
    deactivate(c1)

    activate(c.take(1))
    expect(b).not.to.be.active()
  })
})
