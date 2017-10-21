/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Kefir = require('../../dist/kefir')

describe('constant', function() {
  it('should return property', () => expect(Kefir.constant(1)).toBeProperty())

  return it('should be ended and has current', () => expect(Kefir.constant(1)).toEmit([{current: 1}, '<end:current>']))
})
