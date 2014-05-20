var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".scan()", function(){

  function sum(a, b){
    return a + b;
  }

  it("stream.scan()", function(){

    var stream = new Kefir.Stream();
    var scanned = stream.scan(0, sum);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasCached()).toBe(true);
    expect(scanned.getCached()).toBe(0);

    var result = helpers.getOutput(scanned);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [0, 1, 3, 6]
    });

  });

  it("property.scan()", function(){

    var prop = new Kefir.Property(null, null, 6);
    var scanned = prop.scan(5, sum);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasCached()).toBe(true);
    expect(scanned.getCached()).toBe(11);

    var result = helpers.getOutput(scanned);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [11, 12, 14, 17]
    });

  });


  it("property.scan() w/o initial", function(){

    var prop = new Kefir.Property(null, null);
    var scanned = prop.scan(5, sum);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasCached()).toBe(true);
    expect(scanned.getCached()).toBe(5);

    var result = helpers.getOutput(scanned);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, 6, 8, 11]
    });

  });


});
