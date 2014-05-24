var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".diff()", function(){

  function subtract(prev, next){
    return next - prev;
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
      xs: [1, 1, 2]
    });

  });

  it("property.diff()", function(){

    var prop = new Kefir.Property(null, null, 6);
    var diffs = prop.diff(5, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Property));
    expect(diffs.hasCached()).toBe(true);
    expect(diffs.getCached()).toBe(1);

    var result = helpers.getOutput(diffs);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, -5, 1, 2]
    });

  });


  it("property.diff() w/o initial", function(){

    var prop = new Kefir.Property(null, null);
    var diffs = prop.diff(5, subtract);

    expect(diffs).toEqual(jasmine.any(Kefir.Property));
    expect(diffs.hasCached()).toBe(false);
    expect(diffs.getCached()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(diffs);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [-4, 1, 2]
    });

  });


});
