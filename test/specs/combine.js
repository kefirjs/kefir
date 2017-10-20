/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, activate, deactivate, Kefir} = require('../test-helpers.coffee');


describe('combine', function() {
  describe('array', function() {

    it('should return stream', function() {
      expect(Kefir.combine([])).toBeStream();
      expect(Kefir.combine([stream(), prop()])).toBeStream();
      expect(stream().combine(stream())).toBeStream();
      return expect(prop().combine(prop())).toBeStream();
    });

    it('should be ended if empty array provided', () => expect(Kefir.combine([])).toEmit(['<end:current>']));

    it('should be ended if array of ended observables provided', function() {
      const a = send(stream(), ['<end>']);
      const b = send(prop(), ['<end>']);
      const c = send(stream(), ['<end>']);
      expect(Kefir.combine([a, b, c])).toEmit(['<end:current>']);
      return expect(a.combine(b)).toEmit(['<end:current>']);
  });

    it('should be ended and has current if array of ended properties provided and each of them has current', function() {
      const a = send(prop(), [1, '<end>']);
      const b = send(prop(), [2, '<end>']);
      const c = send(prop(), [3, '<end>']);
      expect(Kefir.combine([a, b, c])).toEmit([{current: [1, 2, 3]}, '<end:current>']);
      return expect(a.combine(b)).toEmit([{current: [1, 2]}, '<end:current>']);
  });

    it('should activate sources', function() {
      const a = stream();
      const b = prop();
      const c = stream();
      expect(Kefir.combine([a, b, c])).toActivate(a, b, c);
      return expect(a.combine(b)).toActivate(a, b);
    });

    it('should handle events and current from observables', function() {
      let a = stream();
      let b = send(prop(), [0]);
      const c = stream();
      expect(Kefir.combine([a, b, c])).toEmit([[1, 0, 2], [1, 3, 2], [1, 4, 2], [1, 4, 5], [1, 4, 6], '<end>'], function() {
        send(a, [1]);
        send(c, [2]);
        send(b, [3]);
        send(a, ['<end>']);
        send(b, [4, '<end>']);
        return send(c, [5, 6, '<end>']);
      });
      a = stream();
      b = send(prop(), [0]);
      return expect(a.combine(b)).toEmit([[1, 0], [1, 2], [1, 3], '<end>'], function() {
        send(a, [1]);
        send(b, [2]);
        send(a, ['<end>']);
        return send(b, [3, '<end>']);
      });
    });

    it('should accept optional combinator function', function() {
      let a = stream();
      let b = send(prop(), [0]);
      const c = stream();
      const join = (...args) => args.join('+');
      expect(Kefir.combine([a, b, c], join)).toEmit(['1+0+2', '1+3+2', '1+4+2', '1+4+5', '1+4+6', '<end>'], function() {
        send(a, [1]);
        send(c, [2]);
        send(b, [3]);
        send(a, ['<end>']);
        send(b, [4, '<end>']);
        return send(c, [5, 6, '<end>']);
      });
      a = stream();
      b = send(prop(), [0]);
      return expect(a.combine(b, join)).toEmit(['1+0', '1+2', '1+3', '<end>'], function() {
        send(a, [1]);
        send(b, [2]);
        send(a, ['<end>']);
        return send(b, [3, '<end>']);
      });
    });

    it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
      const a = send(prop(), [0]);
      const b = send(prop(), [1]);
      const cb = Kefir.combine([a, b]);
      activate(cb);
      deactivate(cb);
      return expect(cb).toEmit([{current: [0, 1]}]);
  });

    it('errors should flow', function() {
      let a = stream();
      let b = prop();
      let c = stream();
      expect(Kefir.combine([a, b, c])).errorsToFlow(a);
      a = stream();
      b = prop();
      c = stream();
      expect(Kefir.combine([a, b, c])).errorsToFlow(b);
      a = stream();
      b = prop();
      c = stream();
      return expect(Kefir.combine([a, b, c])).errorsToFlow(c);
    });

    it('should handle errors correctly', function() {
      // a:      ---e---v---v-----
      //            1
      // b:      ----v---e----v---
      //                 2
      // c:      -----v---e--v----
      //                  3
      // result: ---eee-vee-eev--
      //            111  23 32

      const a = stream();
      const b = stream();
      const c = stream();
      return expect(Kefir.combine([a, b, c])).toEmit([
        {error: -1},
        {error: -1},
        {error: -1},
        [3, 1, 2],
        {error: -2},
        {error: -3},
        {error: -3},
        {error: -2},
        [4, 6, 5]
      ], function() {
        send(a, [{error: -1}]);
        send(b, [1]);
        send(c, [2]);
        send(a, [3]);
        send(b, [{error: -2}]);
        send(c, [{error: -3}]);
        send(a, [4]);
        send(c, [5]);
        return send(b, [6]);
      });
    });



    return describe('sampledBy functionality (3 arity combine)', function() {

      it('should return stream', function() {
        expect(Kefir.combine([], [])).toBeStream();
        return expect(Kefir.combine([stream(), prop()], [stream(), prop()])).toBeStream();
      });

      it('should be ended if empty array provided', function() {
        expect(Kefir.combine([stream(), prop()], [])).toEmit([]);
        return expect(Kefir.combine([], [stream(), prop()])).toEmit(['<end:current>']);
    });

      it('should be ended if array of ended observables provided', function() {
        const a = send(stream(), ['<end>']);
        const b = send(prop(), ['<end>']);
        const c = send(stream(), ['<end>']);
        return expect(Kefir.combine([a, b, c], [stream(), prop()])).toEmit(['<end:current>']);
    });

      it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', function() {
        const a = send(prop(), [1, '<end>']);
        const b = send(prop(), [2, '<end>']);
        const c = send(prop(), [3, '<end>']);
        const s1 = Kefir.combine([a, b], [c]);
        expect(s1).toEmit([{current: [1, 2, 3]}, '<end:current>']);
        return expect(s1).toEmit(['<end:current>']);
    });

      it('should activate sources', function() {
        const a = stream();
        const b = prop();
        const c = stream();
        return expect(Kefir.combine([a, b], [c])).toActivate(a, b, c);
      });

      it('should handle events and current from observables', function() {
        const a = stream();
        const b = send(prop(), [0]);
        const c = stream();
        const d = stream();
        return expect(Kefir.combine([c, d], [a, b])).toEmit([[2, 3, 1, 0], [5, 3, 1, 4], [6, 3, 1, 4], [6, 7, 1, 4], '<end>'], function() {
          send(a, [1]);
          send(c, [2]);
          send(d, [3]);
          send(b, [4, '<end>']);
          send(c, [5, 6, '<end>']);
          return send(d, [7, '<end>']);
        });
      });


      it('should accept optional combinator function', function() {
        const join = (...args) => args.join('+');
        const a = stream();
        const b = send(prop(), [0]);
        const c = stream();
        const d = stream();
        return expect(Kefir.combine([c, d], [a, b], join)).toEmit(['2+3+1+0', '5+3+1+4', '6+3+1+4', '6+7+1+4', '<end>'], function() {
          send(a, [1]);
          send(c, [2]);
          send(d, [3]);
          send(b, [4, '<end>']);
          send(c, [5, 6, '<end>']);
          return send(d, [7, '<end>']);
        });
      });


      it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
        const a = send(prop(), [0]);
        const b = send(prop(), [1]);
        const c = send(prop(), [2]);
        const sb = Kefir.combine([a, b], [c]);
        activate(sb);
        deactivate(sb);
        return expect(sb).toEmit([{current: [0, 1, 2]}]);
    });

      it('errors should flow', function() {
        let a = stream();
        let b = prop();
        let c = stream();
        let d = prop();
        expect(Kefir.combine([a, b], [c, d])).errorsToFlow(a);
        a = stream();
        b = prop();
        c = stream();
        d = prop();
        return expect(Kefir.combine([a, b], [c, d])).errorsToFlow(b);
      });

      // https://github.com/rpominov/kefir/issues/98
      return it('should work nice for emitating atomic updates', function() {
        const a = stream();
        const b = a.map(x => x + 2);
        const c = a.map(x => x * 2);
        return expect(Kefir.combine([b], [c])).toEmit([[3, 2], [4, 4], [5, 6]], () => send(a, [1, 2, 3]));
      });
    });
  });

  describe('object', function() {

    it('should return stream', function() {
      expect(Kefir.combine({})).toBeStream();
      return expect(Kefir.combine({s: stream(), p: prop()})).toBeStream();
    });

    it('should be ended if empty array provided', () => expect(Kefir.combine({})).toEmit(['<end:current>']));

    it('should be ended if array of ended observables provided', function() {
      const a = send(stream(), ['<end>']);
      const b = send(prop(), ['<end>']);
      const c = send(stream(), ['<end>']);
      return expect(Kefir.combine({a, b, c})).toEmit(['<end:current>']);
  });

    it('should be ended and has current if array of ended properties provided and each of them has current', function() {
      const a = send(prop(), [1, '<end>']);
      const b = send(prop(), [2, '<end>']);
      const c = send(prop(), [3, '<end>']);
      return expect(Kefir.combine({a, b, c})).toEmit([{current: {a:1, b:2, c:3}}, '<end:current>']);
  });

    it('should activate sources', function() {
      const a = stream();
      const b = prop();
      const c = stream();
      return expect(Kefir.combine({a, b, c})).toActivate(a, b, c);
    });

    it('should handle events and current from observables', function() {
      const a = stream();
      const b = send(prop(), [0]);
      const c = stream();
      return expect(Kefir.combine({a, b, c})).toEmit([
        {a:1, b:0, c:2},
        {a:1, b:3, c:2},
        {a:1, b:4, c:2},
        {a:1, b:4, c:5},
        {a:1, b:4, c:6},
        '<end>'
      ], function() {
        send(a, [1]);
        send(c, [2]);
        send(b, [3]);
        send(a, ['<end>']);
        send(b, [4, '<end>']);
        return send(c, [5, 6, '<end>']);
      });
    });

    it('should accept optional combinator function', function() {
      const a = stream();
      const b = send(prop(), [0]);
      const c = stream();
      const join = ev => ev.a + '+' + ev.b + '+' + ev.c;
      return expect(Kefir.combine({a, b, c}, join)).toEmit(['1+0+2', '1+3+2', '1+4+2', '1+4+5', '1+4+6', '<end>'], function() {
        send(a, [1]);
        send(c, [2]);
        send(b, [3]);
        send(a, ['<end>']);
        send(b, [4, '<end>']);
        return send(c, [5, 6, '<end>']);
      });
    });

    it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
      const a = send(prop(), [0]);
      const b = send(prop(), [1]);
      const cb = Kefir.combine({a, b});
      activate(cb);
      deactivate(cb);
      return expect(cb).toEmit([{current: {a:0, b:1}}]);
  });

    it('errors should flow', function() {
      let a = stream();
      let b = prop();
      let c = stream();
      expect(Kefir.combine({a, b, c})).errorsToFlow(a);
      a = stream();
      b = prop();
      c = stream();
      expect(Kefir.combine({a, b, c})).errorsToFlow(b);
      a = stream();
      b = prop();
      c = stream();
      return expect(Kefir.combine({a, b, c})).errorsToFlow(c);
    });

    it('should handle errors correctly', function() {
      // a:      ---e---v---v-----
      //            1
      // b:      ----v---e----v---
      //                 2
      // c:      -----v---e--v----
      //                  3
      // result: ---eee-vee-eev--
      //            111  23 32

      const a = stream();
      const b = stream();
      const c = stream();
      return expect(Kefir.combine({a, b, c})).toEmit([
        {error: -1},
        {error: -1},
        {error: -1},
        {a:3, b:1, c:2},
        {error: -2},
        {error: -3},
        {error: -3},
        {error: -2},
        {a:4, b:6, c:5}
      ], function() {
        send(a, [{error: -1}]);
        send(b, [1]);
        send(c, [2]);
        send(a, [3]);
        send(b, [{error: -2}]);
        send(c, [{error: -3}]);
        send(a, [4]);
        send(c, [5]);
        return send(b, [6]);
      });
    });



    return describe('sampledBy functionality (3 arity combine)', function() {

      it('should return stream', function() {
        expect(Kefir.combine({}, {})).toBeStream();
        return expect(Kefir.combine({s1:stream(), p1:prop()}, {s2:stream(), p2:prop()})).toBeStream();
      });

      it('should be ended if empty array provided', function() {
        expect(Kefir.combine({s1:stream(), p1:prop()}, {})).toEmit([]);
        return expect(Kefir.combine({}, {s2:stream(), p2:prop()})).toEmit(['<end:current>']);
    });

      it('should be ended if array of ended observables provided', function() {
        const a = send(stream(), ['<end>']);
        const b = send(prop(), ['<end>']);
        const c = send(stream(), ['<end>']);
        return expect(Kefir.combine({a, b, c}, {d:stream(), e:prop()})).toEmit(['<end:current>']);
    });

      it('should be ended and emmit current (once) if array of ended properties provided and each of them has current', function() {
        const a = send(prop(), [1, '<end>']);
        const b = send(prop(), [2, '<end>']);
        const c = send(prop(), [3, '<end>']);
        const s1 = Kefir.combine({a, b}, {c});
        expect(s1).toEmit([{current: {a:1, b:2, c:3}}, '<end:current>']);
        return expect(s1).toEmit(['<end:current>']);
    });

      it('should activate sources', function() {
        const a = stream();
        const b = prop();
        const c = stream();
        return expect(Kefir.combine({a, b}, {c})).toActivate(a, b, c);
      });

      it('should handle events and current from observables', function() {
        const a = stream();
        const b = send(prop(), [0]);
        const c = stream();
        const d = stream();
        return expect(Kefir.combine({c, d}, {a, b})).toEmit([
          {a:1, b:0, c:2, d:3},
          {a:1, b:4, c:5, d:3},
          {a:1, b:4, c:6, d:3},
          {a:1, b:4, c:6, d:7},
          '<end>'
        ], function() {
          send(a, [1]);
          send(c, [2]);
          send(d, [3]);
          send(b, [4, '<end>']);
          send(c, [5, 6, '<end>']);
          return send(d, [7, '<end>']);
        });
      });


      it('should accept optional combinator function', function() {
        const join = msg => msg.c + "+" + msg.d + "+" + msg.a + "+" + msg.b;
        const a = stream();
        const b = send(prop(), [0]);
        const c = stream();
        const d = stream();
        return expect(Kefir.combine({c, d}, {a, b}, join)).toEmit(['2+3+1+0', '5+3+1+4', '6+3+1+4', '6+7+1+4', '<end>'], function() {
          send(a, [1]);
          send(c, [2]);
          send(d, [3]);
          send(b, [4, '<end>']);
          send(c, [5, 6, '<end>']);
          return send(d, [7, '<end>']);
        });
      });


      it('when activating second time and has 2+ properties in sources, should emit current value at most once', function() {
        const a = send(prop(), [0]);
        const b = send(prop(), [1]);
        const c = send(prop(), [2]);
        const sb = Kefir.combine({a, b}, {c});
        activate(sb);
        deactivate(sb);
        return expect(sb).toEmit([{current: {a:0, b:1, c:2}}]);
    });

      it('errors should flow', function() {
        let a = stream();
        let b = prop();
        let c = stream();
        let d = prop();
        expect(Kefir.combine({a, b}, {c, d})).errorsToFlow(a);
        a = stream();
        b = prop();
        c = stream();
        d = prop();
        return expect(Kefir.combine({a, b}, {c, d})).errorsToFlow(b);
      });

      // https://github.com/rpominov/kefir/issues/98
      it('should work nice for emitating atomic updates', function() {
        const a = stream();
        const b = a.map(x => x + 2);
        const c = a.map(x => x * 2);
        return expect(Kefir.combine({b}, {c})).toEmit([
          {b:3, c:2},
          {b:4, c:4},
          {b:5, c:6}
        ], () => send(a, [1, 2, 3]));
      });

      return it('should prefer active keys over passive keys', function() {
        const a = stream();
        const b = stream();
        const _a = stream();

        return expect(Kefir.combine({a, b}, {a: _a})).toEmit([
          {a: 1, b: 4},
          {a: 2, b: 4},
          {a: 3, b: 4}
        ], function() {
          send(_a, [-1]);
          send(a, [1]);
          send(b, [4]);
          send(_a, [-2]);
          send(a, [2]);
          send(_a, [-3]);
          return send(a, [3]);
        });
      });
    });
  });

  return describe('mismatches', () =>
    it('should not allow mismatched argument types', function() {
      const a = stream();
      const b = stream();
      const arrayAndObject = () => Kefir.combine([a],{b});
      const objectAndArray = () => Kefir.combine({a},[b]);
      expect(arrayAndObject).toThrow();
      return expect(objectAndArray).toThrow();
    })
  );
});
