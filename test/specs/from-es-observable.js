/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Observable = require('zen-observable');
const Rx = require('@reactivex/rxjs');
const {activate, deactivate, Kefir} = require('../test-helpers.coffee');

describe('fromESObservable', function() {
  it('turns an ES7 observable into a stream', () => expect(Kefir.fromESObservable(Observable.of(1, 2))).toBeStream());

  it('emits events from observable to stream', function(done) {
    const stream = Kefir.fromESObservable(Observable.of(1, 2));
    const values = [];
    stream.onValue(value => values.push(value));
    return stream.onEnd(function() {
      expect(values).toEqual([1, 2]);
      return done();
    });
  });

  it('ends stream after an error', function(done) {
    const observable = new Observable(function(observer) {
      observer.next(1);
      return observer.error();
    });
    return Kefir.fromESObservable(observable).onEnd(() => done());
  });

  return it('turns an RxJS observable into a Kefir stream', function(done) {
    const stream = Kefir.fromESObservable(Rx.Observable.of('hello world'));
    const values = [];
    stream.onValue(value => values.push(value));
    return stream.onEnd(function() {
      expect(values).toEqual(['hello world']);
      return done();
    });
  });
});
