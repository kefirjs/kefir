/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');



describe('map', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().map(function() {})).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.map(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).map(function() {})).toEmit(['<end:current>']));

    it('should handle events', function() {
      const a = stream();
      return expect(a.map(x => x * 2)).toEmit([2, {error: 5}, 4, '<end>'], () => send(a, [1, {error: 5}, 2, '<end>']));
    });

    return it('should work with default `fn`', function() {
      const a = stream();
      return expect(a.map()).toEmit([1, {error: 5}, 2, '<end>'], () => send(a, [1, {error: 5}, 2, '<end>']));
    });
  });



  return describe('property', function() {

    it('should return property', () => expect(prop().map(function() {})).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.map(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).map(function() {})).toEmit(['<end:current>']));

    return it('should handle events and current', function() {
      let a = send(prop(), [1]);
      expect(a.map(x => x * 2)).toEmit([{current: 2}, 4, {error: 5}, 6, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']));
      a = send(prop(), [{error: 0}]);
      return expect(a.map(x => x * 2)).toEmit([{currentError: 0}, 4, {error: 5}, 6, '<end>'], () => send(a, [2, {error: 5}, 3, '<end>']));
    });
  });
});


