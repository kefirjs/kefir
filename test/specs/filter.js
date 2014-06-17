var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".filter()", function(){

  function isEven(x){
    return x % 2 === 0;
  }

  it("stream.filter()", function(){

    var stream = new Kefir.Stream();
    var filtered = stream.filter(isEven);

    var result = helpers.getOutput(filtered);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendValue(5);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });



  it("property.filter()", function(){

    var prop = new Kefir.Property(6);
    var filtered = prop.filter(isEven);

    expect(filtered).toEqual(jasmine.any(Kefir.Property));
    expect(filtered.hasValue()).toBe(true);
    expect(filtered.getValue()).toBe(6);

    var result = helpers.getOutput(filtered);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(5);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [6, 2, 4]
    });

  });


  it("property.filter() with wrong initial", function(){

    var prop = new Kefir.Property(5);
    var filtered = prop.filter(isEven);

    expect(filtered).toEqual(jasmine.any(Kefir.Property));
    expect(filtered.hasValue()).toBe(false);
    expect(filtered.getValue()).toBe(Kefir.NOTHING);

    var result = helpers.getOutput(filtered);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(5);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });

});
