const {stream, prop, send, value, error, end, expect} = require('../test-helpers')

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
    expect(a.awaiting(b)).to.emit([value(false, {current: true}), value(true), value(false), value(true)], () => {
      send(a, [value(1)])
      send(b, [value(1)])
      send(b, [value(1)])
      send(a, [value(1)])
      send(a, [value(1)])
    })
  })

  it('property and stream', () => {
    const a = send(prop(), [value(1)])
    const b = stream()
    expect(a.awaiting(b)).to.emit([value(true, {current: true}), value(false), value(true)], () => {
      send(a, [value(1)])
      send(b, [value(1)])
      send(b, [value(1)])
      send(a, [value(1)])
      send(a, [value(1)])
    })
  })

  it('property and property', () => {
    const a = send(prop(), [value(1)])
    const b = send(prop(), [value(1)])
    expect(a.awaiting(b)).to.emit([value(false, {current: true}), value(true), value(false), value(true)], () => {
      send(a, [value(1)])
      send(b, [value(1)])
      send(b, [value(1)])
      send(a, [value(1)])
      send(a, [value(1)])
    })
  })
})
