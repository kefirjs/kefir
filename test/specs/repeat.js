/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee');

describe('repeat', function() {

  it('should return stream', () => expect(Kefir.repeat()).toBeStream());

  it('should work correctly (with .constant)', function() {
    const a = Kefir.repeat(i => Kefir[i === 2 ? 'constantError' : 'constant'](i));
    return expect(a.take(3)).toEmit([
      {current: 0},
      {current: 1},
      {currentError: 2},
      {current: 3},
      '<end:current>'
    ]);
});


  it('should work correctly (with .later)', function() {
    const a = Kefir.repeat(i => Kefir.later(100, i));
    return expect(a.take(3)).toEmitInTime([
      [100, 0],
      [200, 1],
      [300, 2],
      [300, '<end>']
    ]);
});

  it('should work correctly (with .sequentially)', function() {
    const a = Kefir.repeat(i => Kefir.sequentially(100, [1, 2, 3]));
    return expect(a.take(5)).toEmitInTime([
      [100, 1],
      [200, 2],
      [300, 3],
      [400, 1],
      [500, 2],
      [500, '<end>']
    ]);
});

  it('should not cause stack overflow', function() {
    const sum = (a, b) => a + b;
    const genConstant = () => Kefir.constant(1);

    const a = Kefir.repeat(genConstant).take(3000).scan(sum, 0).last();
    return expect(a).toEmit([{current: 3000}, '<end:current>']);
});


  it('should get new source only if previous one ended', function() {
    let a = stream();

    let callsCount = 0;
    const b = Kefir.repeat(function() {
      callsCount++;
      if (!a._alive) {
        a = stream();
      }
      return a;
    });

    expect(callsCount).toBe(0);
    activate(b);
    expect(callsCount).toBe(1);
    deactivate(b);
    activate(b);
    expect(callsCount).toBe(1);
    send(a, ['<end>']);
    return expect(callsCount).toBe(2);
  });



  it('should unsubscribe from source', function() {
    const a = stream();
    const b = Kefir.repeat(() => a);
    return expect(b).toActivate(a);
  });



  return it('should end when falsy value returned from generator', function() {
    const a = Kefir.repeat(function(i) {
      if (i < 3) {
        return Kefir.constant(i);
      } else {
        return false;
      }
    });
    return expect(a).toEmit([
      {current: 0},
      {current: 1},
      {current: 2},
      '<end:current>'
    ]);
});
});

