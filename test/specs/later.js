const {Kefir} = require('../test-helpers')
const {expect} = require('../test-helpers')

describe('later', () => {
  it('should return stream', () => {
    expect(Kefir.later(100, 1)).to.be.observable.stream()
  })

  it('should emmit value after interval then end', () => {
    expect(Kefir.later(100, 1)).to.emitInTime([[100, 1], [100, '<end>']])
  })
})
