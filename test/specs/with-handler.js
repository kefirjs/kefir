/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {stream, prop, send, Kefir} = require('../test-helpers.coffee');



describe('withHandler', function() {


  const mirror = function(emitter, event) {
    switch (event.type) {
      case 'value': return emitter.emit(event.value);
      case 'error': return emitter.error(event.value);
      case 'end': return emitter.end();
    }
  };

  const emitEventMirror = (emitter, event) => emitter.emitEvent(event);


  const duplicate = function(emitter, event) {
    if (event.type === 'value') {
      emitter.emit(event.value);
      if (!event.current) {
        return emitter.emit(event.value);
      }
    } else if (event.type === 'error') {
      emitter.error(event.value);
      if (!event.current) {
        return emitter.error(event.value);
      }
    } else {
      return emitter.end();
    }
  };



  describe('stream', function() {

    it('should return stream', () => expect(stream().withHandler(function() {})).toBeStream());

    it('should activate/deactivate source', function() {
      const a = stream();
      return expect(a.withHandler(function() {})).toActivate(a);
    });

    it('should not be ended if source was ended (by default)', () => expect(send(stream(), ['<end>']).withHandler(function() {})).toEmit([]));

    it('should be ended if source was ended (with `mirror` handler)', () => expect(send(stream(), ['<end>']).withHandler(mirror)).toEmit(['<end:current>']));

    it('should handle events (with `duplicate` handler)', function() {
      const a = stream();
      return expect(a.withHandler(duplicate)).toEmit([1, 1, {error: 3}, {error: 3}, 2, 2, '<end>'], () => send(a, [1, {error: 3}, 2, '<end>']));
    });

    it('should automatically preserve isCurent (end)', function() {
      const a = stream();
      expect(a.withHandler(mirror)).toEmit(['<end>'], () => send(a, ['<end>']));
      return expect(a.withHandler(mirror)).toEmit(['<end:current>']);
  });

    return it('should support emitter.emitEvent', function() {
      const a = stream();
      return expect(a.withHandler(emitEventMirror)).toEmit([1, {error: 3}, 2, '<end>'], () => send(a, [1, {error: 3}, 2, '<end>']));
    });
  });



  return describe('property', function() {

    it('should return property', () => expect(prop().withHandler(function() {})).toBeProperty());

    it('should activate/deactivate source', function() {
      const a = prop();
      return expect(a.withHandler(function() {})).toActivate(a);
    });

    it('should not be ended if source was ended (by default)', () => expect(send(prop(), ['<end>']).withHandler(function() {})).toEmit([]));

    it('should be ended if source was ended (with `mirror` handler)', () => expect(send(prop(), ['<end>']).withHandler(mirror)).toEmit(['<end:current>']));

    it('should handle events and current (with `duplicate` handler)', function() {
      let a = send(prop(), [1]);
      expect(a.withHandler(duplicate)).toEmit([{current: 1}, 2, 2, {error: 4}, {error: 4}, 3, 3, '<end>'], () => send(a, [2, {error: 4}, 3, '<end>']));
      a = send(prop(), [{error: 0}]);
      return expect(a.withHandler(duplicate)).toEmit([{currentError: 0}, 2, 2, {error: 4}, {error: 4}, 3, 3, '<end>'], () => send(a, [2, {error: 4}, 3, '<end>']));
    });

    it('should support emitter.emitEvent', function() {
      const a = send(prop(), [1]);
      expect(a.withHandler(emitEventMirror)).toEmit([{current: 1}, 2, {error: 4}, 3, '<end>'], () => send(a, [2, {error: 4}, 3, '<end>']));
      return expect(send(prop(), [{error: -1}]).withHandler(emitEventMirror)).toEmit([{currentError: -1}]);
  });

    it('should automatically preserve isCurent (end)', function() {
      const a = prop();
      expect(a.withHandler(mirror)).toEmit(['<end>'], () => send(a, ['<end>']));
      return expect(a.withHandler(mirror)).toEmit(['<end:current>']);
  });

    it('should automatically preserve isCurent (value)', function() {
      const a = prop();
      expect(a.withHandler(mirror)).toEmit([1], () => send(a, [1]));
      expect(a.withHandler(mirror)).toEmit([{current: 1}]);

      let savedEmitter = null;
      return expect(
        a.withHandler(function(emitter, event) {
          mirror(emitter, event);
          return savedEmitter = emitter;})
      ).toEmit([{current: 1}, 2], () => savedEmitter.emit(2));
    });

    return it('should automatically preserve isCurent (error)', function() {
      const a = prop();
      expect(a.withHandler(mirror)).toEmit([{error: 1}], () => send(a, [{error: 1}]));
      expect(a.withHandler(mirror)).toEmit([{currentError: 1}]);

      let savedEmitter = null;
      return expect(
        a.withHandler(function(emitter, event) {
          mirror(emitter, event);
          return savedEmitter = emitter;})
      ).toEmit([{currentError: 1}, {error: 2}], () => savedEmitter.emit({error: 2}));
    });
  });
});


