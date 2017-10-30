const sinon = require('sinon')
const {stream, expect} = require('../test-helpers')

describe('thru', () => {
  it('should call function and return result', () => {
    const spy = sinon.spy(() => 0)
    const a = stream()

    expect(a.thru(spy)).to.equal(0)
    expect(spy.calledWith(a)).to.equal(true)
  })
})
