const {Kefir, expect} = require('../test-helpers')

describe('fromPoll', () => {
  it('should return stream', () => {
    expect(Kefir.fromPoll(100, () => {})).to.be.observable.stream()
  })

  it('should emit whatever fn returns at certain time', () => {
    let i = 0
    expect(Kefir.fromPoll(100, () => ++i)).to.emitInTime([[100, 1], [200, 2], [300, 3]], undefined, {timeLimit: 350})
  })
})
