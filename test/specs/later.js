var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe("Kefir.later()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it("ok", function(){

    var stream = Kefir.later(30, 2);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    clock.tick(10);
    expect(result.xs).toEqual([]);

    clock.tick(21);
    expect(result.xs).toEqual([2]);
    expect(result.ended).toEqual(true);

  });

  it("2 subscribers", function(){

    var stream = Kefir.later(30, 2);

    var result = helpers.getOutput(stream);
    var result2 = null;

    setTimeout(function(){
      result2 = helpers.getOutput(stream);
    }, 15);

    expect(result.xs).toEqual([]);
    expect(result2).toBe(null);

    clock.tick(16);
    expect(result.xs).toEqual([]);
    expect(result2.xs).toEqual([]);

    clock.tick(15);
    expect(result.xs).toEqual([2]);
    expect(result2.xs).toEqual([2]);
    expect(result.ended).toEqual(true);

  });

  it("no subscribers on delivering time", function(){

    var stream = Kefir.later(30, 2);

    var calls = 0;
    function fn(){
      calls++;
    }

    stream.onValue(fn);
    stream.offValue(fn);

    clock.tick(31);
    expect(calls).toBe(0);
    expect(stream.isEnded()).toBe(false);

    stream.onValue(fn);
    expect(calls).toBe(0);
    expect(stream.isEnded()).toBe(false);

    clock.tick(31);
    expect(calls).toBe(1);
    expect(stream.isEnded()).toBe(true);

  });

  it(".later(delay, Kefir.error('e'))", function(){

    var stream = Kefir.later(30, Kefir.error('e'));

    var result = helpers.getOutputAndErrors(stream);

    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual([]);

    clock.tick(10);
    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual([]);

    clock.tick(21);
    expect(result.xs).toEqual([]);
    expect(result.errors).toEqual(['e']);
    expect(result.ended).toEqual(true);

  });


});
