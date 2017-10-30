const {Kefir, expect} = require('../test-helpers')

describe('constant', () => {
  it('should return property', () => {
    expect(Kefir.constant(1)).to.be.observable.property()
  })

  it('should be ended and has current', () => {
    expect(Kefir.constant(1)).to.emit([{current: 1}, '<end:current>'])
  })
})
