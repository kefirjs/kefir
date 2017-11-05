const {value, end, Kefir, expect} = require('../test-helpers')

describe('sequentially', () => {
  it('should return stream', () => {
    expect(Kefir.sequentially(100, [1, 2, 3])).to.be.observable.stream()
  })

  it('should be ended if empty array provided', () => {
    expect(Kefir.sequentially(100, [])).to.emitInTime([[0, end({current: true})]])
  })

  it('should emmit values at certain time then end', () => {
    expect(Kefir.sequentially(100, [1, 2, 3])).to.emitInTime([
      [100, value(1)],
      [200, value(2)],
      [300, value(3)],
      [300, end()],
    ])
  })
})
