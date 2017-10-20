/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Kefir = require('../../dist/kefir');

describe('interval', function() {

  it('should return stream', () => expect(Kefir.interval(100, 1)).toBeStream());

  return it('should repeat same value at certain time', () => expect(Kefir.interval(100, 1)).toEmitInTime([[ 100, 1 ], [ 200, 1 ], [ 300, 1 ]], null, 350));
});
