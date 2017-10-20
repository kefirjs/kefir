/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');

describe('bufferWithCount', function() {

  describe('stream', function() {

    it('should return stream', () => expect(stream().bufferWithCount(1)).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.bufferWithCount(1)).toActivate(a);
    });

    it('should be ended if source was ended', () =>
      expect(send(stream(), ['<end>']).bufferWithCount(1)).toEmit([
        '<end:current>'
      ])
    );

    it('.bufferWithCount(1) should work correctly', function() {
      const a = stream();
      return expect(a.bufferWithCount(1)).toEmit([
        [1],
        [2],
        [3],
        [4],
        [5],
        '<end>'
      ], () => send(a, [1, 2, 3, 4, 5,'<end>']));
    });

    it('.bufferWithCount(2) should work correctly', function() {
      const a = stream();
      return expect(a.bufferWithCount(2)).toEmit([
        [1, 2],
        [3, 4],
        [5], 
        '<end>'
      ], () => send(a, [1, 2, 3, 4, 5,'<end>']));
    });

    it('.bufferWithCount(3) should work correctly', function() {
      const a = stream();
      return expect(a.bufferWithCount(3)).toEmit([
        [1, 2, 3],
        [4, 5],
        '<end>'
      ], () => send(a, [1, 2, 3, 4, 5,'<end>']));
    });

    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      const a = stream();
      return expect(a.bufferWithCount(3, {flushOnEnd: false})).toEmit([
        [1, 2, 3],
        '<end>'
      ], () => send(a, [1, 2, 3, 4, 5,'<end>']));
    });

    return it('errors should flow', function() {
      const a = stream();
      return expect(a.bufferWithCount(3)).errorsToFlow(a);
    });
  });


  return describe('property', function() {

    it('should return property', () => expect(prop().bufferWithCount(1)).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.bufferWithCount(1)).toActivate(a);
    });

    it('should be ended if source was ended', () =>
      expect(send(prop(), ['<end>']).bufferWithCount(1)).toEmit([
        '<end:current>'
      ])
  );

    it('.bufferWithCount(1) should work correctly', function() {
      const a = send(prop(), [1]);
      return expect(a.bufferWithCount(1)).toEmit([
        { current : [1] },
        [2],
        [3],
        [4],
        [5],
        '<end>'
      ], () => send(a, [2, 3, 4, 5,'<end>']));
    });

    it('.bufferWithCount(2) should work correctly', function() {
      const a = send(prop(), [1]);
      return expect(a.bufferWithCount(2)).toEmit([
        [1, 2],
        [3, 4],
        [5], 
        '<end>'
      ], () => send(a, [2, 3, 4, 5,'<end>']));
    });

    it('.bufferWithCount(3) should work correctly', function() {
      const a = send(prop(), [1]);
      return expect(a.bufferWithCount(3)).toEmit([
        [1, 2, 3],
        [4, 5],
        '<end>'
      ], () => send(a, [2, 3, 4, 5,'<end>']));
    });

    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      const a = send(prop(), [1]);
      return expect(a.bufferWithCount(3, {flushOnEnd: false})).toEmit([
        [1, 2, 3],
        '<end>'
      ], () => send(a, [2, 3, 4, 5,'<end>']));
    });

    return it('errors should flow', function() {
      const a = prop();
      return expect(a.bufferWithCount(3)).errorsToFlow(a);
    });
  });
});
