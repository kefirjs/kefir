const {Kefir, expect} = require('../test-helpers')

describe('constantError', () => {
  it('should return property', () => {
    expect(Kefir.constantError(1)).to.be.observable.property()
  })

  it('should be ended and has a current error', () => {
    expect(Kefir.constantError(1)).to.emit([{currentError: 1}, '<end:current>'])
  })
})
