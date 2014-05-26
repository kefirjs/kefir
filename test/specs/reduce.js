var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".reduce()", function(){

  function sum(a, b){
    return a + b;
  }

  it("stream.reduce()", function(){

    var stream = new Kefir.Stream();
    var reduced = stream.reduce(0, sum);

    expect(reduced).toEqual(jasmine.any(Kefir.Property));
    expect(reduced.hasCached()).toBe(false);
    expect(reduced.getCached()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(reduced);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [6]
    });

  });

  it("property.reduce()", function(){

    var prop = new Kefir.Property(null, null, 6);
    var reduced = prop.reduce(5, sum);

    expect(reduced).toEqual(jasmine.any(Kefir.Property));
    expect(reduced.hasCached()).toBe(false);
    expect(reduced.getCached()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(reduced);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [17]
    });

  });


  it("property.reduce() w/o initial", function(){

    var prop = new Kefir.Property(null, null);
    var reduced = prop.reduce(5, sum);

    expect(reduced).toEqual(jasmine.any(Kefir.Property));
    expect(reduced.hasCached()).toBe(false);
    expect(reduced.getCached()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(reduced);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [11]
    });

  });



  it(".reduce() and errors", function(){

    var stream = new Kefir.Stream();
    var reduced = stream.reduce(0, sum);

    var result = helpers.getOutputAndErrors(reduced);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [],
      errors: ['e1', 'e2']
    });

  });


});
