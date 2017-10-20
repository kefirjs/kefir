/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {activate, deactivate, Kefir} = require('../test-helpers.coffee');


describe('fromCallback', function() {

  it('should return stream', () => expect(Kefir.fromCallback(function() {})).toBeStream());

  it('should not be ended', () => expect(Kefir.fromCallback(function() {})).toEmit([]));

  it('should call `callbackConsumer` on first activation, and only on first', function() {
    let count = 0;
    const s = Kefir.fromCallback(() => count++);
    expect(count).toBe(0);
    activate(s);
    expect(count).toBe(1);
    deactivate(s);
    activate(s);
    deactivate(s);
    activate(s);
    return expect(count).toBe(1);
  });

  it('should emit first result and end after that', function() {
    let cb = null;
    return expect(
      Kefir.fromCallback(_cb => cb = _cb)
    ).toEmit([1, '<end>'], () => cb(1));
  });

  it('should work after deactivation/activate cicle', function() {
    let cb = null;
    const s = Kefir.fromCallback(_cb => cb = _cb);
    activate(s);
    deactivate(s);
    activate(s);
    deactivate(s);
    return expect(s).toEmit([1, '<end>'], () => cb(1));
  });

  return it('should emit a current, if `callback` is called immediately in `callbackConsumer`', () =>
    expect(
      Kefir.fromCallback(cb => cb(1))
    ).toEmit([{current: 1}, '<end:current>'])
);
});
