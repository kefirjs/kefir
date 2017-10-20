/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee');


describe('pool', function() {

  it('should return stream', function() {
    expect(Kefir.pool()).toBeStream();
    return expect(new Kefir.Pool()).toBeStream();
  });

  it('should return pool', function() {
    expect(Kefir.pool()).toBePool();
    return expect(new Kefir.Pool()).toBePool();
  });

  it('should activate sources', function() {
    const a = stream();
    const b = prop();
    const c = stream();
    const pool = Kefir.pool().plug(a).plug(b).plug(c);
    expect(pool).toActivate(a, b, c);
    pool.unplug(b);
    expect(pool).toActivate(a, c);
    return expect(pool).not.toActivate(b);
  });

  it('should deliver events from observables', function() {
    const a = stream();
    const b = send(prop(), [0]);
    const c = stream();
    const pool = Kefir.pool().plug(a).plug(b).plug(c);
    return expect(pool).toEmit([{current: 0}, 1, 2, 3, 4, 5, 6], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
  });

  it('should deliver currents from all source properties, but only to first subscriber on each activation', function() {
    const a = send(prop(), [0]);
    const b = send(prop(), [1]);
    const c = send(prop(), [2]);

    let pool = Kefir.pool().plug(a).plug(b).plug(c);
    expect(pool).toEmit([{current: 0}, {current: 1}, {current: 2}]);

    pool = Kefir.pool().plug(a).plug(b).plug(c);
    activate(pool);
    expect(pool).toEmit([]);

    pool = Kefir.pool().plug(a).plug(b).plug(c);
    activate(pool);
    deactivate(pool);
    return expect(pool).toEmit([{current: 0}, {current: 1}, {current: 2}]);
});

  it('should not deliver events from removed sources', function() {
    const a = stream();
    const b = send(prop(), [0]);
    const c = stream();
    const pool = Kefir.pool().plug(a).plug(b).plug(c).unplug(b);
    return expect(pool).toEmit([1, 3, 5, 6], function() {
      send(a, [1]);
      send(b, [2]);
      send(c, [3]);
      send(a, ['<end>']);
      send(b, [4, '<end>']);
      return send(c, [5, 6, '<end>']);
    });
  });

  it('should correctly handle current values of new sub sources', function() {
      const pool = Kefir.pool();
      const b = send(prop(), [1]);
      const c = send(prop(), [2]);
      return expect(pool).toEmit([1, 2], function() {
        pool.plug(b);
        return pool.plug(c);
      });
  });


  return it('errors should flow', function() {
    const a = stream();
    const b = prop();
    const c = stream();
    const pool = Kefir.pool();
    pool.plug(a);
    expect(pool).errorsToFlow(a);
    pool.unplug(a);
    expect(pool).not.errorsToFlow(a);
    pool.plug(a);
    pool.plug(b);
    expect(pool).errorsToFlow(a);
    expect(pool).errorsToFlow(b);
    pool.unplug(b);
    expect(pool).not.errorsToFlow(b);
    pool.plug(c);
    return expect(pool).errorsToFlow(c);
  });
});







