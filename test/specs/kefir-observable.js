let {Kefir} = require('../test-helpers.coffee');

describe('Kefir.Observable', function () {
  describe('observe', function () {
    let em, count, obs, sub;

    beforeEach(function () {
      em = null;
      count = 0;
      obs = Kefir.stream(_em => {
        em = _em;
      });
      sub = obs.observe({next: () => count++, error: () => count--, complete: () => count = 0});
    });

    it('should return a Subscription', function () {
      expect(sub.closed).toBe(false);
      expect(typeof sub.unsubscribe).toBe('function');
    });

    it('should call Observer methods', function () {
      expect(count).toBe(0);

      em.emit(1);
      expect(count).toBe(1);

      em.emit(1);
      expect(count).toBe(2);

      em.error(1);
      expect(count).toBe(1);

      em.end();
      expect(count).toBe(0);
      expect(sub.closed).toBe(true);
    });

    it('should unsubcribe early', function () {
      expect(count).toBe(0);

      em.emit(1);
      expect(count).toBe(1);

      sub.unsubscribe();

      em.emit(1);
      expect(count).toBe(1);
      expect(sub.closed).toBe(true);
    });
  });
});
