const {Kefir, expect, value, end} = require('../test-helpers')

describe('constant', () => {
  it('should return property', () => {
    expect(Kefir.constant(1)).to.be.observable.property()
  })

  it('should be ended and has current', () => {
    expect(Kefir.constant(1)).to.emit([value(1, {current: true}), end({current: true})])
  })
})
