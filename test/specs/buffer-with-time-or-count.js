/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');


const intv = 300;
const cnt = 4;


describe('bufferWithTimeOrCount', function() {


  describe('stream', function() {

    it('should return stream', () => expect(stream().bufferWithTimeOrCount(intv, cnt)).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.bufferWithTimeOrCount(intv, cnt)).toActivate(a);
    });

    it('should be ended if source was ended', () => expect(send(stream(), ['<end>']).bufferWithTimeOrCount(intv, cnt)).toEmit(['<end:current>']));

    it('should flush buffer when either interval or count is reached', function() {
      const a = stream();
      return expect(a.bufferWithTimeOrCount(intv, cnt)).toEmitInTime(
        [[ 300, [1, 2, 3] ], [ 500, [4, 5, 6, 7 ]], [ 800, [] ], [ 900, [8, 9] ], [ 900, '<end>' ]],
        function(tick) {
          tick(100); send(a, [1]);
          tick(100); send(a, [2]);
          tick(99); send(a, [3]);
          tick(51); send(a, [4]);
          tick(50); send(a, [5]);
          tick(50); send(a, [6]);
          tick(50); send(a, [7]);
          tick(301); send(a, [8]);
          tick(99); return send(a, [9, '<end>']);
      });
    });

    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      const a = stream();
      return expect(a.bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).toEmitInTime(
        [[ 300, [1, 2, 3] ], [ 500, [4, 5, 6, 7] ], [ 700, '<end>' ]],
        function(tick) {
          tick(100); send(a, [1]);
          tick(100); send(a, [2]);
          tick(99); send(a, [3]);
          tick(51); send(a, [4]);
          tick(50); send(a, [5]);
          tick(50); send(a, [6]);
          tick(50); send(a, [7]);
          tick(100); send(a, [8]);
          tick(100); return send(a, [9, '<end>']);
      });
    });

    return it('errors should flow', function() {
      const a = stream();
      return expect(a.bufferWithTimeOrCount(intv, cnt)).errorsToFlow(a);
    });
  });



  return describe('property', function() {

    it('should return property', () => expect(prop().bufferWithTimeOrCount(intv, cnt)).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.bufferWithTimeOrCount(intv, cnt)).toActivate(a);
    });

    it('should be ended if source was ended', function() {
      expect(send(prop(), ['<end>']).bufferWithTimeOrCount(intv, cnt)).toEmit(['<end:current>']);
      expect(send(prop(), [1, '<end>']).bufferWithTimeOrCount(intv, cnt)).toEmit([{current: [1]}, '<end:current>']);
      return expect(send(prop(), [1, '<end>']).bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).toEmit(['<end:current>']);
  });

    it('should flush buffer when either interval or count is reached', function() {
      const a = send(prop(), [0]);
      return expect(a.bufferWithTimeOrCount(intv, cnt)).toEmitInTime(
        [[ 300, [0, 1, 2] ], [ 500, [3, 4, 5, 6] ], [ 800, [] ],[ 900, [7, 8] ],[ 900, '<end>' ]],
        function(tick) {
          tick(100); send(a, [1]);
          tick(100); send(a, [2]);
          tick(150); send(a, [3]);
          tick(50); send(a, [4]);
          tick(50); send(a, [5]);
          tick(50); send(a, [6]);
          tick(301); send(a, [7]);
          tick(99); return send(a, [8, '<end>']);
      });
    });

    it('should not flush buffer on end if {flushOnEnd: false}', function() {
      const a = send(prop(), [0]);
      return expect(a.bufferWithTimeOrCount(intv, cnt, {flushOnEnd: false})).toEmitInTime(
        [[ 300, [0, 1, 2] ], [ 500, [3, 4, 5, 6] ], [ 700, '<end>' ]],
        function(tick) {
          tick(100); send(a, [1]);
          tick(100); send(a, [2]);
          tick(150); send(a, [3]);
          tick(50); send(a, [4]);
          tick(50); send(a, [5]);
          tick(50); send(a, [6]);
          tick(100); send(a, [7]);
          tick(100); return send(a, [8, '<end>']);
      });
    });

    return it('errors should flow', function() {
      const a = prop();
      return expect(a.bufferWithTimeOrCount(intv, cnt)).errorsToFlow(a);
    });
  });
});
