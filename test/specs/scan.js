var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".scan()", function(){

  function subtract(a, b){
    return a - b;
  }

  it("stream.scan()", function(){

    var stream = new Kefir.Stream();
    var scanned = stream.scan(0, subtract);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasValue()).toBe(true);
    expect(scanned.getValue()).toBe(0);

    var result = helpers.getOutput(scanned);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [0, -1, -3, -6]
    });

  });

  it("property.scan()", function(){

    var prop = new Kefir.Property(6);
    var scanned = prop.scan(5, subtract);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasValue()).toBe(true);
    expect(scanned.getValue()).toBe(-1);

    var result = helpers.getOutput(scanned);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [-1, -2, -4, -7]
    });

  });


  it("property.scan() w/o initial", function(){

    var prop = new Kefir.Property(null, null);
    var scanned = prop.scan(5, subtract);

    expect(scanned).toEqual(jasmine.any(Kefir.Property));
    expect(scanned.hasValue()).toBe(true);
    expect(scanned.getValue()).toBe(5);

    var result = helpers.getOutput(scanned);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, 4, 2, -1]
    });

  });



  it(".scan() and errors", function(){

    var stream = new Kefir.Stream();
    var scanned = stream.scan(0, subtract);

    var result = helpers.getOutputAndErrors(scanned);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [0, -1],
      errors: ['e1', 'e2']
    });

  });


});
