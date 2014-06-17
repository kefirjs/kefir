var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".diff()", function(){

  function subtract(prev, next){
    return prev - next;
  }

  it("stream.diff()", function(){

    var stream = new Kefir.Stream();
    var diffs = stream.diff(0, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(diffs);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(4);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [-1, -1, -2]
    });

  });

  it("property.diff()", function(){

    var prop = new Kefir.Property(6);

    var diffs = prop.diff(5, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Property));
    expect(diffs.hasValue()).toBe(true);
    expect(diffs.getValue()).toBe(-1);

    var result = helpers.getOutput(diffs);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [-1, 5, -1, -2]
    });

  });


  it("property.diff() w/o initial", function(){

    var prop = new Kefir.Property();
    var diffs = prop.diff(5, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Property));
    expect(diffs.hasValue()).toBe(false);
    expect(diffs.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(diffs);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [4, -1, -2]
    });

  });


});
