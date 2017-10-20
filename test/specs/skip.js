/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');



describe('skip', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().skip(3)).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.skip(3)).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).skip(3)).toEmit(['<end:current>']));

    it('should handle events (less than `n`)', function() {
      const a = stream();
      return expect(a.skip(3)).toEmit(['<end>'], () => send(a, [1, 2, '<end>']));
    });

    it('should handle events (more than `n`)', function() {
      const a = stream();
      return expect(a.skip(3)).toEmit([4, 5, '<end>'], () => send(a, [1, 2, 3, 4, 5, '<end>']));
    });

    it('should handle events (n == 0)', function() {
      const a = stream();
      return expect(a.skip(0)).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, '<end>']));
    });

    it('should handle events (n == -1)', function() {
      const a = stream();
      return expect(a.skip(-1)).toEmit([1, 2, 3, '<end>'], () => send(a, [1, 2, 3, '<end>']));
    });

    return it('errors should flow', function() {
      const a = stream();
      return expect(a.skip(1)).errorsToFlow(a);
    });
  });




  return describe('property', function() {

    it('should return property', () => expect(prop().skip(3)).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.skip(3)).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(prop(), ['<end>']).skip(3)).toEmit(['<end:current>']));

    it('should handle events and current (less than `n`)', function() {
      const a = send(prop(), [1]);
      return expect(a.skip(3)).toEmit(['<end>'], () => send(a, [2, '<end>']));
    });

    it('should handle events and current (more than `n`)', function() {
      const a = send(prop(), [1]);
      return expect(a.skip(3)).toEmit([4, 5, '<end>'], () => send(a, [2, 3, 4, 5, '<end>']));
    });

    it('should handle events and current (n == 0)', function() {
      const a = send(prop(), [1]);
      return expect(a.skip(0)).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, '<end>']));
    });

    it('should handle events and current (n == -1)', function() {
      const a = send(prop(), [1]);
      return expect(a.skip(-1)).toEmit([{current: 1}, 2, 3, '<end>'], () => send(a, [2, 3, '<end>']));
    });

    return it('errors should flow', function() {
      const a = prop();
      return expect(a.skip(1)).errorsToFlow(a);
    });
  });
});




