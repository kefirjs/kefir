/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Kefir = require('../../dist/kefir');

describe('never', function() {

  it('should return stream', () => expect(Kefir.never()).toBeStream());

  return it('should be ended', () => expect(Kefir.never()).toEmit(['<end:current>']));
});
