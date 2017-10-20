/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');



describe('mapErrors', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().mapErrors(function() {})).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.mapErrors(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).mapErrors(function() {})).toEmit(['<end:current>']));

    return it('should handle events', function() {
      const a = stream();
      return expect(a.mapErrors(x => x * 2)).toEmit([1, {error: -2}, 2, {error: -4}, '<end>'], () => send(a, [1, {error: -1}, 2, {error: -2}, '<end>']));
    });
  });



  return describe('property', function() {

    it('should return property', () => expect(prop().mapErrors(function() {})).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.mapErrors(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).mapErrors(function() {})).toEmit(['<end:current>']));

    return it('should handle events and current', function() {
      let a = send(prop(), [1]);
      expect(a.mapErrors(x => x * 2)).toEmit([{current: 1}, 2, {error: -4}, 3, {error: -6}, '<end>'], () => send(a, [2, {error: -2}, 3, {error: -3}, '<end>']));
      a = send(prop(), [{error: -1}]);
      return expect(a.mapErrors(x => x * 2)).toEmit([{currentError: -2}, 2, {error: -4}, 3, {error: -6}, '<end>'], () => send(a, [2, {error: -2}, 3, {error: -3}, '<end>']));
    });
  });
});


