var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".skipDuplicates()", function(){

  it("stream.skipDuplicates()", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.skipDuplicates();

    var result = helpers.getOutput(mapped);

    stream.__sendValue(null);
    stream.__sendValue(null);
    stream.__sendValue(undefined);
    stream.__sendValue(undefined);
    stream.__sendValue(false);
    stream.__sendValue(0);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [null, undefined, false, 0, 1, 2, 3]
    });

  });


  it("property.skipDuplicates()", function(){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.skipDuplicates();

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(5);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(null);
    prop.__sendValue(null);
    prop.__sendValue(undefined);
    prop.__sendValue(undefined);
    prop.__sendValue(false);
    prop.__sendValue(0);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, null, undefined, false, 0, 1, 2, 3]
    });

  });


  it("property.skipDuplicates() w/o initial", function(){

    var prop = new Kefir.Property();
    var mapped = prop.skipDuplicates();

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasCached()).toBe(false);
    expect(mapped.getCached()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(null);
    prop.__sendValue(null);
    prop.__sendValue(undefined);
    prop.__sendValue(undefined);
    prop.__sendValue(false);
    prop.__sendValue(0);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [null, undefined, false, 0, 1, 2, 3]
    });

  });


  it("stream.skipDuplicates(fn)", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.skipDuplicates(function(a, b){ return a == b });

    var result = helpers.getOutput(mapped);

    stream.__sendValue(null);
    stream.__sendValue(null);
    stream.__sendValue(undefined);
    stream.__sendValue(undefined);
    stream.__sendValue(false);
    stream.__sendValue(0);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [null, false, 1, 2, 3]
    });

  });


  it("property.skipDuplicates(fn)", function(){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.skipDuplicates(function(a, b){ return a == b });

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(5);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(null);
    prop.__sendValue(null);
    prop.__sendValue(undefined);
    prop.__sendValue(undefined);
    prop.__sendValue(false);
    prop.__sendValue(0);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, null, false, 1, 2, 3]
    });

  });


});
