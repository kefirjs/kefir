const Kefir = require('../../dist/kefir')

describe('withInterval', () => {
  it('should return stream', () => {
    expect(Kefir.withInterval(100, () => {})).toBeStream()
  })

  it('should work as expected', () => {
    let i = 0
    const fn = emitter => {
      i++
      if (i === 2) {
        emitter.error(-1)
      } else {
        emitter.emit(i)
        emitter.emit(i * 2)
      }
      if (i === 3) {
        return emitter.end()
      }
    }
    expect(Kefir.withInterval(100, fn)).toEmitInTime([
      [100, 1],
      [100, 2],
      [200, {error: -1}],
      [300, 3],
      [300, 6],
      [300, '<end>'],
    ])
  })

  it('should support emitter.emitEvent', () => {
    let i = 0
    const fn = emitter => {
      i++
      if (i === 2) {
        emitter.emitEvent({type: 'error', value: -1, current: false})
      } else {
        emitter.emitEvent({type: 'value', value: i, current: true}) // current should be ignored
        emitter.emitEvent({type: 'value', value: i * 2, current: false})
      }
      if (i === 3) {
        return emitter.emitEvent({type: 'end', value: undefined, current: false})
      }
    }
    expect(Kefir.withInterval(100, fn)).toEmitInTime([
      [100, 1],
      [100, 2],
      [200, {error: -1}],
      [300, 3],
      [300, 6],
      [300, '<end>'],
    ])
  })
})
