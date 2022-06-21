const {value, Kefir, expect} = require('../test-helpers')

describe('fromPoll', () => {
  it('should return stream', () => {
    expect(Kefir.fromPoll(100, () => {})).to.be.observable.stream()
  })

  it('should emit whatever fn returns at certain time', () => {
    let i = 0
    expect(Kefir.fromPoll(100, () => ++i)).to.emitInTime(
      [
        [100, value(1)],
        [200, value(2)],
        [300, value(3)],
      ],
      undefined,
      {timeLimit: 350}
    )
  })
})
