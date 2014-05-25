var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".merge()", function(){

  it("3 streams", function(){

    var stream1 = new Kefir.Stream()              // 1
    var stream2 = new Kefir.Stream()              // -2-4
    var stream3 = new Kefir.Stream()              // --3-5
    var merged = stream1.merge(stream2, stream3); // 12345

    var result = helpers.getOutput(merged)

    stream1.__sendValue(1);
    stream1.__sendEnd();
    stream2.__sendValue(2);
    stream3.__sendValue(3);
    stream2.__sendValue(4);
    stream2.__sendEnd();
    stream3.__sendValue(5);
    stream3.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4, 5]
    });

  });


  it("3 properties end 1 stream", function(){

    var prop1 = new Kefir.Property(null, null, 6);    // 6-1
    var prop2 = new Kefir.Property(null, null, 7);    // 7--2--5
    var prop3 = new Kefir.Property();                 // ----3
    var stream1 = new Kefir.Stream();                 // -----4
    var merged = prop1.merge(prop2, prop3, stream1);  // 6712345

    var result = helpers.getOutput(merged);

    prop1.__sendValue(1);
    prop1.__sendEnd();
    prop2.__sendValue(2);
    prop3.__sendValue(3);
    prop3.__sendEnd();
    stream1.__sendValue(4);
    stream1.__sendEnd();
    prop2.__sendValue(5);
    prop2.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [6, 7, 1, 2, 3, 4, 5]
    });

  });



  it("errors", function(){
    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();
    var merged = stream1.merge(stream2);

    var result = helpers.getOutputAndErrors(merged);

    stream1.__sendError('e1');
    stream2.__sendError('e2');
    stream1.__sendError('e3');
    stream2.__sendError('e4');

    expect(result).toEqual({ended: false, xs: [], errors: ['e1', 'e2', 'e3', 'e4']});
  })


});
