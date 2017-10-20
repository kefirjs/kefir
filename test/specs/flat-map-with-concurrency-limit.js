/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee');


describe('flatMapConcurLimit', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().flatMapConcurLimit(null, 1)).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.flatMapConcurLimit(null, 1)).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).flatMapConcurLimit(null, 1)).toEmit(['<end:current>']));

    it('should handle events', function() {
      const a = stream();
      const b = stream();
      const c = stream();
      const d = stream();
      return expect(a.flatMapConcurLimit(null, 2)).toEmit([1, 2, 4, 5, 6, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1]);
        send(a, [c, d, '<end>']);
        send(c, [2]);
        send(d, [3]);
        send(b, [4, '<end>']);
        send(d, [5, '<end>']);
        return send(c, [6, '<end>']);
      });
    });


    it('should activate sub-sources', function() {
      const a = stream();
      const b = stream();
      const c = stream();
      const d = stream();
      const map = a.flatMapConcurLimit(null, 2);
      activate(map);
      send(a, [b, c, d]);
      deactivate(map);
      expect(map).toActivate(b, c);
      expect(map).not.toActivate(d);
      send(b, ['<end>']);
      return expect(map).toActivate(d);
    });


    it('should accept optional map fn', function() {
      const a = stream();
      const b = stream();
      return expect(
        a.flatMapConcurLimit((x => x.obs), 1)
      ).toEmit([1, 2, '<end>'], function() {
        send(b, [0]);
        send(a, [{obs: b}, '<end>']);
        return send(b, [1, 2, '<end>']);
      });
    });

    it('should correctly handle current values of sub sources on activation', function() {
      const a = stream();
      const b = send(prop(), [1]);
      const c = send(prop(), [2]);
      const d = send(prop(), [3]);
      const m = a.flatMapConcurLimit(null, 2);
      activate(m);
      send(a, [b, c, d]);
      deactivate(m);
      return expect(m).toEmit([{current: 1}, {current: 2}]);
  });

    it('should correctly handle current values of new sub sources', function() {
      const a = stream();
      const b = send(prop(), [1, '<end>']);
      const c = send(prop(), [2]);
      const d = send(prop(), [3]);
      const e = send(prop(), [4]);
      return expect(a.flatMapConcurLimit(null, 2)).toEmit([4, 1, 2], () => send(a, [e, b, c, d]));
    });

    it('limit = 0', function() {
      const a = stream();
      return expect(a.flatMapConcurLimit(null, 0)).toEmit(['<end:current>']);
  });

    it('limit = -1', function() {
      const a = stream();
      const b = stream();
      const c = stream();
      const d = stream();
      return expect(a.flatMapConcurLimit(null, -1)).toEmit([1, 2, 3, 4, 5, 6, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1]);
        send(a, [c, d, '<end>']);
        send(c, [2]);
        send(d, [3]);
        send(b, [4, '<end>']);
        send(d, [5, '<end>']);
        return send(c, [6, '<end>']);
      });
    });

    return it('limit = -2', function() { // same as -1
      const a = stream();
      const b = stream();
      const c = stream();
      const d = stream();
      return expect(a.flatMapConcurLimit(null, -2)).toEmit([1, 2, 3, 4, 5, 6, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1]);
        send(a, [c, d, '<end>']);
        send(c, [2]);
        send(d, [3]);
        send(b, [4, '<end>']);
        send(d, [5, '<end>']);
        return send(c, [6, '<end>']);
      });
    });
  });







  return describe('property', function() {

    it('should return stream', () => expect(prop().flatMapConcurLimit(null, 1)).toBeStream());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.flatMapConcurLimit(null, 1)).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).flatMapConcurLimit(null, 1)).toEmit(['<end:current>']));

    it('should be ended if source was ended (with value)', () =>
      expect(
        send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapConcurLimit(null, 1)
      ).toEmit([{current: 0}, '<end:current>'])
  );

    return it('should correctly handle current value of source', function() {
      const a = send(prop(), [0]);
      const b = send(prop(), [a]);
      return expect(b.flatMapConcurLimit(null, 1)).toEmit([{current: 0}]);
  });
});
});


