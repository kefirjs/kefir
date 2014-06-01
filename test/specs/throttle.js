var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe(".throttle()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers(10000);
  });

  afterEach(function() {
    clock.restore();
  });


  it("stream.throttle(100)", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading
    stream.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([1]);

    // trailing
    clock.tick(25);
    stream.__sendValue(2);
    expect(result.xs).toEqual([1]);
    clock.tick(26);
    expect(result.xs).toEqual([1, 2]);

    // skipped as leading
    clock.tick(80);
    stream.__sendValue(3);
    expect(result.xs).toEqual([1, 2]);

    // but delivered as trailing
    clock.tick(21)
    expect(result.xs).toEqual([1, 2, 3]);

    // leading again
    clock.tick(101)
    stream.__sendValue(4);
    expect(result.xs).toEqual([1, 2, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1, 2, 3, 4]);
  });



  it("stream.throttle(100, {leading: false})", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100, {leading: false});
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading (skipped)
    stream.__sendValue(1);
    expect(result.xs).toEqual([]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([]);

    // trailing
    clock.tick(25);
    stream.__sendValue(2);
    expect(result.xs).toEqual([]);
    clock.tick(26);
    expect(result.xs).toEqual([2]);

    // skipped as leading
    clock.tick(80);
    stream.__sendValue(3);
    expect(result.xs).toEqual([2]);

    // but delivered as trailing (but only after `wait`ms)
    clock.tick(101)
    expect(result.xs).toEqual([2, 3]);

    // leading again (will be delivered as trailing)
    clock.tick(101)
    stream.__sendValue(4);
    expect(result.xs).toEqual([2, 3]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([2, 3, 4]);
  });




  it("stream.throttle(100, {trailing: false})", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100, {trailing: false});
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading
    stream.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([1]);

    // trailing (skipped too)
    clock.tick(25);
    stream.__sendValue(2);
    expect(result.xs).toEqual([1]);
    clock.tick(26);
    expect(result.xs).toEqual([1]);

    // leading (after more than `wait` ms after last delivered)
    clock.tick(80);
    stream.__sendValue(3);
    expect(result.xs).toEqual([1, 3]);

    // skipped
    clock.tick(50);
    stream.__sendValue(0);

    // leading (after more than `wait` ms after last skipped)
    clock.tick(101)
    stream.__sendValue(4);
    expect(result.xs).toEqual([1, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1, 3, 4]);
  });



  it("stream.throttle(100, {trailing: false, leading: false})", function(){
    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100, {trailing: false, leading: false});
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading (skipped)
    stream.__sendValue(0);
    expect(result.xs).toEqual([]);

    // less than `wait` ms after leading (skipped)
    clock.tick(50);
    stream.__sendValue(0);
    expect(result.xs).toEqual([]);

    // more than `wait` ms after leading (delivered)
    clock.tick(51);
    stream.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // trailing (skipped)
    clock.tick(50);
    stream.__sendValue(0);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1]);
  });


  it("end w/ trailing", function(){

    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendEnd();

    expect(result.xs).toEqual([1]);
    expect(result.ended).toBe(false);

    clock.tick(101);
    expect(result.ended).toBe(true);
    expect(result.xs).toEqual([1, 2]);

  });


  it("end w/o trailing", function(){

    var stream = new Kefir.Stream();
    var throttled = stream.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(throttled);

    stream.__sendValue(1);
    stream.__sendEnd();

    expect(result.xs).toEqual([1]);
    expect(result.ended).toBe(true);

  });



  it("property.throttle(100) w/ initial", function(){
    var property = new Kefir.Property(null, null, 10);
    var throttled = property.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Property));
    expect(throttled.hasValue()).toBe(true);
    expect(throttled.getValue()).toBe(10);

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([10]);

    // leading
    property.__sendValue(1);
    expect(result.xs).toEqual([10, 1]);

    // skipped
    clock.tick(50);
    property.__sendValue(0);
    expect(result.xs).toEqual([10, 1]);

    // trailing
    clock.tick(25);
    property.__sendValue(2);
    expect(result.xs).toEqual([10, 1]);
    clock.tick(26);
    expect(result.xs).toEqual([10, 1, 2]);

    // skipped as leading
    clock.tick(80);
    property.__sendValue(3);
    expect(result.xs).toEqual([10, 1, 2]);

    // but delivered as trailing
    clock.tick(21)
    expect(result.xs).toEqual([10, 1, 2, 3]);

    // leading again
    clock.tick(101)
    property.__sendValue(4);
    expect(result.xs).toEqual([10, 1, 2, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([10, 1, 2, 3, 4]);
    expect(throttled.getValue()).toBe(4);

  });


  it("property.throttle(100) w/o initial", function(){
    var property = new Kefir.Property();
    var throttled = property.throttle(100);
    expect(throttled).toEqual(jasmine.any(Kefir.Property));
    expect(throttled.hasValue()).toBe(false);
    expect(throttled.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(throttled);
    expect(result.xs).toEqual([]);

    // leading
    property.__sendValue(1);
    expect(result.xs).toEqual([1]);

    // skipped
    clock.tick(50);
    property.__sendValue(0);
    expect(result.xs).toEqual([1]);

    // trailing
    clock.tick(25);
    property.__sendValue(2);
    expect(result.xs).toEqual([1]);
    clock.tick(26);
    expect(result.xs).toEqual([1, 2]);

    // skipped as leading
    clock.tick(80);
    property.__sendValue(3);
    expect(result.xs).toEqual([1, 2]);

    // but delivered as trailing
    clock.tick(21)
    expect(result.xs).toEqual([1, 2, 3]);

    // leading again
    clock.tick(101)
    property.__sendValue(4);
    expect(result.xs).toEqual([1, 2, 3, 4]);

    // final state
    clock.tick(100000)
    expect(result.xs).toEqual([1, 2, 3, 4]);
    expect(throttled.getValue()).toBe(4);

  });


});
