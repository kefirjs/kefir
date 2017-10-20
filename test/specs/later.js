/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Kefir = require('../../dist/kefir');

describe('later', function() {

  it('should return stream', () => expect(Kefir.later(100, 1)).toBeStream());

  return it('should emmit value after interval then end', () => expect(Kefir.later(100, 1)).toEmitInTime([[100, 1], [100, '<end>']]));
});
