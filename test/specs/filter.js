/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');



describe('filter', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().filter(function() {})).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.filter(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).filter(function() {})).toEmit(['<end:current>']));

    it('should handle events', function() {
      const a = stream();
      return expect(a.filter(x => x > 3)).toEmit([4, 5, {error: 7}, 6, '<end>'], () => send(a, [1, 2, 4, 5, 0, {error: 7}, 6, '<end>']));
    });

    return it('shoud use id as default predicate', function() {
      const a = stream();
      return expect(a.filter()).toEmit([4, 5, {error: 7}, 6, '<end>'], () => send(a, [0, 0, 4, 5, 0, {error: 7}, 6, '<end>']));
    });
  });


  return describe('property', function() {

    it('should return property', () => expect(prop().filter(function() {})).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.filter(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).filter(function() {})).toEmit(['<end:current>']));

    it('should handle events and current', function() {
      let a = send(prop(), [5]);
      expect(a.filter(x => x > 2)).toEmit([{current: 5}, 4, {error: 7}, 3, '<end>'], () => send(a, [4, {error: 7}, 3, 2, 1, '<end>']));
      a = send(prop(), [{error: 0}]);
      return expect(a.filter(x => x > 2)).toEmit([{currentError: 0}, 4, {error: 7}, 3, '<end>'], () => send(a, [4, {error: 7}, 3, 2, 1, '<end>']));
    });

    it('should handle current (not pass)', function() {
      const a = send(prop(), [1, {error: 0}]);
      return expect(a.filter(x => x > 2)).toEmit([{currentError: 0}]);
  });

    return it('shoud use id as default predicate', function() {
      let a = send(prop(), [0]);
      expect(a.filter()).toEmit([4, {error: -2}, 5, 6, '<end>'], () => send(a, [0, 4, {error: -2}, 5, 0, 6, '<end>']));
      a = send(prop(), [1]);
      return expect(a.filter()).toEmit([{current: 1}, 4, {error: -2}, 5, 6, '<end>'], () => send(a, [0, 4, {error: -2}, 5, 0, 6, '<end>']));
    });
  });
});


