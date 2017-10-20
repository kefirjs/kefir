/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee');


describe('flatMapLatest', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().flatMapLatest()).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.flatMapLatest()).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).flatMapLatest()).toEmit(['<end:current>']));

    it('should handle events', function() {
      const a = stream();
      const b = stream();
      const c = send(prop(), [0]);
      return expect(a.flatMapLatest()).toEmit([1, 0, 3, 5, '<end>'], function() {
        send(b, [0]);
        send(a, [b]);
        send(b, [1]);
        send(a, [c]);
        send(b, [2]);
        send(c, [3]);
        send(a, [b, '<end>']);
        send(c, [4]);
        return send(b, [5, '<end>']);
      });
    });

    it('should activate sub-sources (only latest)', function() {
      const a = stream();
      const b = stream();
      const c = send(prop(), [0]);
      const map = a.flatMapLatest();
      activate(map);
      send(a, [b, c]);
      deactivate(map);
      expect(map).toActivate(c);
      return expect(map).not.toActivate(b);
    });

    it('should accept optional map fn', function() {
      const a = stream();
      const b = stream();
      return expect(a.flatMapLatest(x => x.obs)).toEmit([1, 2, '<end>'], function() {
        send(a, [{obs: b}, '<end>']);
        return send(b, [1, 2, '<end>']);
      });
    });

    it('should correctly handle current values of sub sources on activation', function() {
      const a = stream();
      const b = send(prop(), [1]);
      const c = send(prop(), [2]);
      const m = a.flatMapLatest();
      activate(m);
      send(a, [b, c]);
      deactivate(m);
      return expect(m).toEmit([{current: 2}]);
  });

    it('should correctly handle current values of new sub sources', function() {
      const a = stream();
      const b = send(prop(), [1]);
      const c = send(prop(), [2]);
      return expect(a.flatMapLatest()).toEmit([1, 2], () => send(a, [b, c]));
    });

    return it('should work nicely with Kefir.constant and Kefir.never', function() {
      const a = stream();
      return expect(
        a.flatMapLatest(function(x) {
          if (x > 2) {
            return Kefir.constant(x);
          } else {
            return Kefir.never();
          }})
      ).toEmit([3, 4, 5], () => send(a, [1, 2, 3, 4, 5]));
    });
  });





  return describe('property', function() {

    it('should return stream', () => expect(prop().flatMapLatest()).toBeStream());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.flatMapLatest()).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).flatMapLatest()).toEmit(['<end:current>']));

    it('should be ended if source was ended (with value)', () =>
      expect(
        send(prop(), [send(prop(), [0, '<end>']), '<end>']).flatMapLatest()
      ).toEmit([{current: 0}, '<end:current>'])
  );

    return it('should correctly handle current value of source', function() {
      const a = send(prop(), [0]);
      const b = send(prop(), [a]);
      return expect(b.flatMapLatest()).toEmit([{current: 0}]);
  });
});
});
