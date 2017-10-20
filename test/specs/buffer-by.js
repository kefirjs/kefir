/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir, deactivate, activate} = require('../test-helpers.coffee');



describe('bufferBy', function() {

  describe('common', function() {

    it('should activate/deactivate sources', function() {
      let a = stream();
      let b = stream();
      expect(a.bufferBy(b)).toActivate(a, b);
      a = stream();
      b = prop();
      expect(a.bufferBy(b)).toActivate(a, b);
      a = prop();
      b = stream();
      expect(a.bufferBy(b)).toActivate(a, b);
      a = prop();
      b = prop();
      return expect(a.bufferBy(b)).toActivate(a, b);
    });

    it('should end when primary ends', function() {
      expect(send(stream(), ['<end>']).bufferBy(stream())).toEmit([{current: []}, '<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferBy(b)).toEmit([[], '<end>'], () => send(a, ['<end>']));
    });

    it('should flush buffer on end', function() {
      expect(send(prop(), [1, '<end>']).bufferBy(stream())).toEmit([{current: [1]}, '<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferBy(b)).toEmit([[1, 2], '<end>'], () => send(a, [1, 2, '<end>']));
    });

    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      expect(send(prop(), [1, '<end>']).bufferBy(stream(), {flushOnEnd: false})).toEmit(['<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferBy(b, {flushOnEnd: false})).toEmit(['<end>'], () => send(a, [1, 2, '<end>']));
    });

    it('should not end when secondary ends', function() {
      expect(stream().bufferBy(send(stream(), ['<end>']))).toEmit([]);
      const a = stream();
      const b = stream();
      return expect(a.bufferBy(b)).toEmit([], () => send(b, ['<end>']));
    });

    it('should do end when secondary ends if {flushOnEnd: false}', function() {
      expect(stream().bufferBy(send(stream(), ['<end>']), {flushOnEnd: false})).toEmit(['<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferBy(b, {flushOnEnd: false})).toEmit(['<end>'], () => send(b, ['<end>']));
    });

    it('should flush buffer on each value from secondary', function() {
      const a = stream();
      const b = stream();
      return expect(a.bufferBy(b)).toEmit([[], [1, 2], [], [3]], function() {
        send(b, [0]);
        send(a, [1, 2]);
        send(b, [0]);
        send(b, [0]);
        send(a, [3]);
        send(b, [0]);
        return send(a, [4]);
      });
    });

    return it('errors should flow', function() {
      let a = stream();
      let b = stream();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.bufferBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.bufferBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.bufferBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.bufferBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.bufferBy(b)).errorsToFlow(b);
    });
  });



  describe('stream + stream', () =>

    it('returns stream', () => expect(stream().bufferBy(stream())).toBeStream())
  );



  describe('stream + property', () =>

    it('returns stream', () => expect(stream().bufferBy(prop())).toBeStream())
  );



  describe('property + stream', function() {

    it('returns property', () => expect(prop().bufferBy(stream())).toBeProperty());

    return it('includes current to buffer', function() {
      const a = send(prop(), [1]);
      const b = stream();
      return expect(a.bufferBy(b)).toEmit([[1]], () => send(b, [0]));
    });
  });



  return describe('property + property', function() {

    it('returns property', () => expect(prop().bufferBy(prop())).toBeProperty());

    return it('both have current', function() {
      const a = send(prop(), [1]);
      const b = send(prop(), [2]);
      return expect(a.bufferBy(b)).toEmit([{current: [1]}]);
  });
});
});

