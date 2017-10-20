/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');


const handler = x =>
  ({
    convert: x >= 0,
    value: x * 3
  })
;


describe('errorsToValues', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().errorsToValues(function() {})).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.errorsToValues(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).errorsToValues(function() {})).toEmit(['<end:current>']));

    it('should handle events', function() {
      const a = stream();
      return expect(a.errorsToValues(handler)).toEmit([1, 6, {error: -1}, 9, 4, '<end>'], () =>
        send(a, [
          1,
          {error: 2},
          {error: -1},
          {error: 3},
          4,
          '<end>'
        ])
      );
    });

    return it('default handler should convert all errors', function() {
      const a = stream();
      return expect(a.errorsToValues()).toEmit([1, 2, -1, 3, 4, '<end>'], () =>
        send(a, [
          1,
          {error: 2},
          {error: -1},
          {error: 3},
          4,
          '<end>'
        ])
      );
    });
  });



  return describe('property', function() {

    it('should return property', () => expect(prop().errorsToValues(function() {})).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.errorsToValues(function() {})).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).errorsToValues(function() {})).toEmit(['<end:current>']));

    it('should handle events', function() {
      const a = send(prop(), [1]);
      return expect(a.errorsToValues(handler)).toEmit([{current: 1}, 6, {error: -1}, 9, 4, '<end>'], () =>
        send(a, [
          {error: 2},
          {error: -1},
          {error: 3},
          4,
          '<end>'
        ])
      );
    });

    return it('should handle currents', function() {
      let a = send(prop(), [{error: -2}]);
      expect(a.errorsToValues(handler)).toEmit([{currentError: -2}]);
      a = send(prop(), [{error: 2}]);
      expect(a.errorsToValues(handler)).toEmit([{current: 6}]);
      a = send(prop(), [1]);
      return expect(a.errorsToValues(handler)).toEmit([{current: 1}]);
    });
  });
});




