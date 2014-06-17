var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".skipWhile(fn)", function(){

  function lessThan3(x){
    return x < 3;
  }

  it("stream.skipWhile(fn)", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.skipWhile(lessThan3);

    var result = helpers.getOutput(mapped);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendValue(1);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [3, 4, 1]
    });

  });


  it("property.skipWhile(fn) skip initial", function(){

    var prop = new Kefir.Property(1);
    var mapped = prop.skipWhile(lessThan3);

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(false);
    expect(mapped.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(1);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [3, 4, 1]
    });

  });


  it("property.skipWhile(fn) not skip initial", function(){

    var prop = new Kefir.Property(5);
    var mapped = prop.skipWhile(lessThan3);

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasValue()).toBe(true);
    expect(mapped.getValue()).toBe(5);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [5, 2, 3, 4]
    });

  });






});
