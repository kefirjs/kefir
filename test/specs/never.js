const {Kefir, expect} = require('../test-helpers')

describe('never', () => {
  it('should return stream', () => {
    expect(Kefir.never()).to.be.observable.stream()
  })

  it('should be ended', () => {
    expect(Kefir.never()).to.emit(['<end:current>'])
  })
})
