const {stream, prop, send, expect} = require('../test-helpers')

describe('setName', () => {
  it('should return same observable', () => {
    const a = stream()
    expect(a.setName('foo')).to.equal(a)
    expect(a.setName(stream(), 'foo')).to.equal(a)
  })

  it('should update observable name', () => {
    const a = stream()
    expect(a.toString()).to.equal('[stream]')
    a.setName('foo')
    expect(a.toString()).to.equal('[foo]')
    a.setName(stream().setName('foo'), 'bar')
    expect(a.toString()).to.equal('[foo.bar]')
  })
})

describe('awaiting', () => {
  it('stream and stream', () => {
    const a = stream()
    const b = stream()
    expect(a.awaiting(b)).to.emit([{current: false}, true, false, true], () => {
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      send(a, [1])
    })
  })

  it('property and stream', () => {
    const a = send(prop(), [1])
    const b = stream()
    expect(a.awaiting(b)).to.emit([{current: true}, false, true], () => {
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      send(a, [1])
    })
  })

  it('property and property', () => {
    const a = send(prop(), [1])
    const b = send(prop(), [1])
    expect(a.awaiting(b)).to.emit([{current: false}, true, false, true], () => {
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      send(a, [1])
    })
  })
})
