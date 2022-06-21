const {value, Kefir, expect} = require('../test-helpers')

describe('interval', () => {
  it('should return stream', () => {
    expect(Kefir.interval(100, 1)).to.be.observable.stream()
  })

  it('should repeat same value at certain time', () => {
    expect(Kefir.interval(100, 1)).to.emitInTime(
      [
        [100, value(1)],
        [200, value(1)],
        [300, value(1)],
      ],
      undefined,
      {
        timeLimit: 350,
      }
    )
  })
})
