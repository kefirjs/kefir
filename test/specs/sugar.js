/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send} = require('../test-helpers')

describe('setName', function() {
  it('should return same observable', function() {
    const a = stream()
    expect(a.setName('foo')).toBe(a)
    return expect(a.setName(stream(), 'foo')).toBe(a)
  })

  return it('should update observable name', function() {
    const a = stream()
    expect(a.toString()).toBe('[stream]')
    a.setName('foo')
    expect(a.toString()).toBe('[foo]')
    a.setName(stream().setName('foo'), 'bar')
    return expect(a.toString()).toBe('[foo.bar]')
  })
})

describe('awaiting', function() {
  it('stream and stream', function() {
    const a = stream()
    const b = stream()
    return expect(a.awaiting(b)).toEmit([{current: false}, true, false, true], function() {
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      return send(a, [1])
    })
  })

  it('property and stream', function() {
    const a = send(prop(), [1])
    const b = stream()
    return expect(a.awaiting(b)).toEmit([{current: true}, false, true], function() {
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      return send(a, [1])
    })
  })

  return it('property and property', function() {
    const a = send(prop(), [1])
    const b = send(prop(), [1])
    return expect(a.awaiting(b)).toEmit([{current: false}, true, false, true], function() {
      send(a, [1])
      send(b, [1])
      send(b, [1])
      send(a, [1])
      return send(a, [1])
    })
  })
})
