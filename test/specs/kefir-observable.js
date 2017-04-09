let {Kefir} = require('../test-helpers.coffee');

describe('Kefir.Observable', () => {
  describe('observe', () => {
    let em, count, obs, sub;

    beforeEach(() => {
      em = null;
      count = 0;
      obs = Kefir.stream(_em => {
        em = _em;
      });
      sub = obs.observe({value: () => count++, error: () => count--, end: () => count = 0});
    });

    it('should return a Subscription', () => {
      expect(sub.closed).toBe(false);
      expect(typeof sub.unsubscribe).toBe('function');
    });

    it('should call Observer methods', () => {
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

    it('should unsubcribe early', () => {
      expect(count).toBe(0);

      em.emit(1);
      expect(count).toBe(1);

      sub.unsubscribe();

      em.emit(1);
      expect(count).toBe(1);
      expect(sub.closed).toBe(true);
    });

    it('closed=true after end (w/o end handler)', () => {
      obs = Kefir.stream(_em => {
        em = _em;
      });
      sub = obs.observe(() => {});
      em.end();
      expect(sub.closed).toBe(true);
    });
  });
});
