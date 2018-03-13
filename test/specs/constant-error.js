const {Kefir, error, end, expect} = require('../test-helpers')

describe('constantError', () => {
  it('should return property', () => {
    expect(Kefir.constantError(1)).to.be.observable.property()
  })

  it('should be ended and has a current error', () => {
    expect(Kefir.constantError(1)).to.emit([error(1, {current: true}), end({current: true})])
  })
})
