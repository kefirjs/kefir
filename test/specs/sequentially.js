/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Kefir = require('../../dist/kefir');

describe('sequentially', function() {

  it('should return stream', () => expect(Kefir.sequentially(100, [1, 2, 3])).toBeStream());

  it('should be ended if empty array provided', () => expect(Kefir.sequentially(100, [])).toEmitInTime([[0, '<end:current>']]));

  return it('should emmit values at certain time then end', () => expect(Kefir.sequentially(100, [1, 2, 3])).toEmitInTime([[ 100, 1 ], [ 200, 2 ], [ 300, 3 ], [ 300, '<end>' ]]));
});
