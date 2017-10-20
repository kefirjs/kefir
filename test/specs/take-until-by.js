/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');



describe('takeUntilBy', function() {

  describe('common', () =>

    it('errors should flow', function() {
      let a = stream();
      let b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.takeUntilBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.takeUntilBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.takeUntilBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.takeUntilBy(b)).errorsToFlow(b);
    })
  );





  describe('stream, stream', function() {

    it('should return a stream', () => expect(stream().takeUntilBy(stream())).toBeStream());

    it('should activate/deactivate sources', function() {
      const a = stream();
      const b = stream();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });

    it('should be ended if primary was ended', () => expect(send(stream(), ['<end>']).takeUntilBy(stream())).toEmit(['<end:current>']));

    it('should not be ended if secondary was ended', () => expect(stream().takeUntilBy(send(stream(), ['<end>']))).toEmit([]));

    it('should not end when secondary ends if there was no values from it', function() {
      const a = stream();
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit([], () => send(b, ['<end>']));
    });

    it('should end on first any value from secondary', function() {
      const a = stream();
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], () => send(b, [0]));
    });

    it('should emit values from primary until first value from secondary', function() {
      const a = stream();
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], () => send(a, [1, 2]));
    });

    return it('should take values as expected', function() {
      const a = stream();
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit([3, 4, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });


  describe('stream, property', function() {

    it('should return a stream', () => expect(stream().takeUntilBy(prop())).toBeStream());

    it('should activate/deactivate sources', function() {
      const a = stream();
      const b = prop();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });

    it('should be ended if primary was ended', () => expect(send(stream(), ['<end>']).takeUntilBy(prop())).toEmit(['<end:current>']));

    it('should not be ended if secondary was ended and has no current', () => expect(stream().takeUntilBy(send(prop(), ['<end>']))).toEmit([]));

    it('should be ended if secondary was ended and has any current', () => expect(stream().takeUntilBy(send(prop(), [0, '<end>']))).toEmit(['<end:current>']));

    it('should end on first any value from secondary', function() {
      const a = stream();
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], () => send(b, [0]));
    });

    it('should not end when secondary ends there was no values from it', function() {
      const a = stream();
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit([], () => send(b, ['<end>']));
    });

    it('should emit values from primary until first value from secondary', function() {
      const a = stream();
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], () => send(a, [1, 2]));
    });

    return it('should take values as expected', function() {
      const a = stream();
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit([3, 4, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [0]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });


  describe('property, stream', function() {

    it('should return a property', () => expect(prop().takeUntilBy(stream())).toBeProperty());

    it('should activate/deactivate sources', function() {
      const a = prop();
      const b = stream();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });

    it('should be ended if primary was ended', () => expect(send(prop(), ['<end>']).takeUntilBy(stream())).toEmit(['<end:current>']));

    it('should not be ended if secondary was ended', () => expect(prop().takeUntilBy(send(stream(), ['<end>']))).toEmit([]));

    it('should not end when secondary ends if there was no values from it', function() {
      const a = prop();
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit([], () => send(b, ['<end>']));
    });

    it('should end on first any value from secondary', function() {
      const a = prop();
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], () => send(b, [0]));
    });

    it('should emit values from primary until first value from secondary', function() {
      const a = prop();
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], () => send(a, [1, 2]));
    });

    return it('should take values as expected', function() {
      const a = send(prop(), [0]);
      const b = stream();
      return expect(a.takeUntilBy(b)).toEmit([{current: 0}, 3, 4, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });

  return describe('property, property', function() {

    it('should return a property', () => expect(prop().takeUntilBy(prop())).toBeProperty());

    it('should activate/deactivate sources', function() {
      const a = prop();
      const b = prop();
      return expect(a.takeUntilBy(b)).toActivate(a, b);
    });

    it('should be ended if primary was ended', () => expect(send(prop(), ['<end>']).takeUntilBy(prop())).toEmit(['<end:current>']));

    it('should not be ended if secondary was ended and has no current', () => expect(prop().takeUntilBy(send(prop(), ['<end>']))).toEmit([]));

    it('should be ended if secondary was ended and has any current', () => expect(prop().takeUntilBy(send(prop(), [0, '<end>']))).toEmit(['<end:current>']));

    it('should end on first any value from secondary', function() {
      const a = prop();
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit(['<end>'], () => send(b, [0]));
    });

    it('should not end when secondary ends if there was no values from it', function() {
      const a = prop();
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit([], () => send(b, ['<end>']));
    });

    it('should emit values from primary until first value from secondary', function() {
      const a = prop();
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit([1, 2], () => send(a, [1, 2]));
    });

    return it('should take values as expected', function() {
      const a = send(prop(), [0]);
      const b = prop();
      return expect(a.takeUntilBy(b)).toEmit([{current: 0}, 3, 4, '<end>'], function() {
        send(a, [3, 4]);
        send(b, [1]);
        send(a, [5, 6]);
        send(b, [false]);
        send(a, [7, 8]);
        send(b, [true]);
        return send(a, [9]);
      });
    });
  });
});
