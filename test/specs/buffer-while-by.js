/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir, deactivate, activate} = require('../test-helpers.coffee');



describe('bufferWhileBy', function() {

  describe('common', function() {

    it('should activate/deactivate sources', function() {
      let a = stream();
      let b = stream();
      expect(a.bufferWhileBy(b)).toActivate(a, b);
      a = stream();
      b = prop();
      expect(a.bufferWhileBy(b)).toActivate(a, b);
      a = prop();
      b = stream();
      expect(a.bufferWhileBy(b)).toActivate(a, b);
      a = prop();
      b = prop();
      return expect(a.bufferWhileBy(b)).toActivate(a, b);
    });

    it('should flush empty buffer and then end when primary ends', function() {
      expect(send(stream(), ['<end>']).bufferWhileBy(stream())).toEmit([{current: []}, '<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([[], '<end>'], () => send(a, ['<end>']));
    });

    it('should flush empty buffer when secondary emits false (w/ {flushOnChange: true})', function() {
      expect(stream().bufferWhileBy(send(prop(), [false]), {flushOnChange: true})).toEmit([{current: []}]);
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b, {flushOnChange: true})).toEmit([[]], () => send(b, [true, false]));
    });

    it('should flush buffer on end', function() {
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream())).toEmit([{current: [1]}, '<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([[1, 2], '<end>'], () => send(a, [1, 2, '<end>']));
    });

    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      expect(send(prop(), [1, '<end>']).bufferWhileBy(stream(), {flushOnEnd: false})).toEmit(['<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit(['<end>'], () => send(a, [1, 2, '<end>']));
    });

    it('should end when secondary ends, if it haven\'t emitted any value (w/ {flushOnEnd: false})', function() {
      expect(stream().bufferWhileBy(send(stream(), ['<end>']), {flushOnEnd: false})).toEmit(['<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit(['<end>'], () => send(b, ['<end>']));
    });

    it('should end when secondary ends, if its last emitted value was truthy (w/ {flushOnEnd: false})', function() {
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']), {flushOnEnd: false})).toEmit(['<end:current>']);
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit(['<end>'], () => send(b, [true, '<end>']));
    });

    it('should not end when secondary ends, if its last emitted value was falsy (w/ {flushOnEnd: false})', function() {
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']), {flushOnEnd: false})).toEmit([]);
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b, {flushOnEnd: false})).toEmit([], () => send(b, [false, '<end>']));
    });

    it('should not end when secondary ends (w/o {flushOnEnd: false})', function() {
      expect(stream().bufferWhileBy(send(prop(), ['<end>']))).toEmit([]);
      let a = stream();
      let b = stream();
      expect(a.bufferWhileBy(b)).toEmit([], () => send(b, ['<end>']));
      expect(stream().bufferWhileBy(send(prop(), [true, '<end>']))).toEmit([]);
      a = stream();
      b = stream();
      expect(a.bufferWhileBy(b)).toEmit([], () => send(b, [true, '<end>']));
      expect(stream().bufferWhileBy(send(prop(), [false, '<end>']))).toEmit([]);
      a = stream();
      b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([], () => send(b, [false, '<end>']));
    });

    it('should flush buffer on each value from primary if last value form secondary was falsy', function() {
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([[1,2,3,4], [5], [6,7,8]], function() {
        send(a, [1, 2]); // buffering
        send(b, [true]);
        send(a, [3]); // still buffering
        send(b, [false]);
        send(a, [4]); // flushing 1,2,3,4
        send(a, [5]); // flushing 5
        send(b, [true]);
        send(a, [6, 7]); // buffering again
        send(b, [false]);
        return send(a, [8]);
      });
    }); // flushing 6,7,8

    it('errors should flow', function() {
      let a = stream();
      let b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = stream();
      expect(a.bufferWhileBy(b)).errorsToFlow(b);
      a = stream();
      b = prop();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = stream();
      b = prop();
      expect(a.bufferWhileBy(b)).errorsToFlow(b);
      a = prop();
      b = prop();
      expect(a.bufferWhileBy(b)).errorsToFlow(a);
      a = prop();
      b = prop();
      return expect(a.bufferWhileBy(b)).errorsToFlow(b);
    });

    return it('should flush on change if {flushOnChange === true}', function() {
      const a = stream();
      const b = stream();
      return expect(a.bufferWhileBy(b, {flushOnChange: true})).toEmit([[1,2,3]], function() {
        send(a, [1, 2]); // buffering
        send(b, [true]);
        send(a, [3]); // still buffering
        return send(b, [false]);
      });
    });
  }); // flush


  describe('stream + stream', () =>

    it('returns stream', () => expect(stream().bufferWhileBy(stream())).toBeStream())
  );



  describe('stream + property', () =>

    it('returns stream', () => expect(stream().bufferWhileBy(prop())).toBeStream())
  );



  describe('property + stream', function() {

    it('returns property', () => expect(prop().bufferWhileBy(stream())).toBeProperty());

    return it('includes current to buffer', function() {
      const a = send(prop(), [1]);
      const b = stream();
      return expect(a.bufferWhileBy(b)).toEmit([[1, 2]], function() {
        send(b, [false]);
        return send(a, [2]);
      });
    });
  });



  return describe('property + property', function() {

    it('returns property', () => expect(prop().bufferWhileBy(prop())).toBeProperty());

    return it('both have current', function() {
      let a = send(prop(), [1]);
      let b = send(prop(), [false]);
      expect(a.bufferWhileBy(b)).toEmit([{current: [1]}]);
      a = send(prop(), [1]);
      b = send(prop(), [true]);
      return expect(a.bufferWhileBy(b)).toEmit([]);
  });
});
});
