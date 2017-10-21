/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Kefir = require('../../dist/kefir')

describe('fromPoll', function() {
  it('should return stream', () => expect(Kefir.fromPoll(100, function() {})).toBeStream())

  return it('should emit whatever fn returns at certain time', function() {
    let i = 0
    return expect(Kefir.fromPoll(100, () => ++i)).toEmitInTime([[100, 1], [200, 2], [300, 3]], null, 350)
  })
})
