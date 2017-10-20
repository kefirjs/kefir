/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');



describe('skipWhile', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().skipWhile(() => false)).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.skipWhile(() => false)).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).skipWhile(() => false)).toEmit(['<end:current>']));

    it('should handle events (`-> true`)', function() {
      const a = stream();
      return expect(a.skipWhile(() => true)).toEmit(['<end>'], () => send(a, [1, 2, '<end>']));
    });

    it('should handle events (`-> false`)', function() {
      const a = stream();
      return expect(a.skipWhile(() => false)).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, '<end>']));
    });

    it('should handle events (`(x) -> x < 3`)', function() {
      const a = stream();
      return expect(a.skipWhile(x => x < 3)).toEmit([3, 4, 5, '<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']));
    });

    it('shoud use id as default predicate', function() {
      const a = stream();
      return expect(a.skipWhile()).toEmit([0, 4, 5, '<end>'], () => send(a, [1, 2, 0, 4, 5, '<end>']));
    });

    return it('errors should flow', function() {
      const a = stream();
      return expect(a.skipWhile()).errorsToFlow(a);
    });
  });





  return describe('property', function() {

    it('should return property', () => expect(prop().skipWhile(() => false)).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.skipWhile(() => false)).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).skipWhile(() => false)).toEmit(['<end:current>']));

    it('should handle events and current (`-> true`)', function() {
      const a = send(prop(), [1]);
      return expect(a.skipWhile(() => true)).toEmit(['<end>'], () => send(a, [2, '<end>']));
    });

    it('should handle events and current (`-> false`)', function() {
      const a = send(prop(), [1]);
      return expect(a.skipWhile(() => false)).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, '<end>']));
    });

    it('should handle events and current (`(x) -> x < 3`)', function() {
      const a = send(prop(), [1]);
      return expect(a.skipWhile(x => x < 3)).toEmit([3, 4, 5, '<end>'], () => send(a, [2, 3, 4, 5, '<end>']));
    });

    it('shoud use id as default predicate', function() {
      let a = send(prop(), [1]);
      expect(a.skipWhile()).toEmit([0, 4, 5, '<end>'], () => send(a, [2, 0, 4, 5, '<end>']));
      a = send(prop(), [0]);
      return expect(a.skipWhile()).toEmit([{current: 0}, 2, 0, 4, 5, '<end>'], () => send(a, [2, 0, 4, 5, '<end>']));
    });

    return it('errors should flow', function() {
      const a = prop();
      return expect(a.skipWhile()).errorsToFlow(a);
    });
  });
});
