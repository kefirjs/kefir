var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".map()", function(){

  function x2(a){
    return a * 2;
  }

  it("stream.map()", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2);

    var result = helpers.getOutput(mapped);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4]
    });

  });


  it("property.map()", function(){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.map(x2);

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(10);

    var result = helpers.getOutput(mapped);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [10, 2, 4]
    });

  });



  it("firstIn/lastOut", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2)

    var result1 = helpers.getOutput(mapped.take(2));
    stream.__sendValue(1)
    expect(stream.__hasSubscribers('value')).toBe(true);
    stream.__sendValue(2)
    expect(stream.__hasSubscribers('value')).toBe(false);
    stream.__sendValue(3)

    var result2 = helpers.getOutput(mapped);

    stream.__sendValue(4)
    stream.__sendValue(5)
    stream.__sendEnd()

    expect(result1).toEqual({
      ended: true,
      xs: [2, 4]
    });

    expect(result2).toEqual({
      ended: true,
      xs: [8, 10]
    });

  });



  it(".map() and errors", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2);

    var result = helpers.getOutputAndErrors(mapped);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [2],
      errors: ['e1', 'e2']
    });

  });


});
