var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".merge()", function(){

  it("3 streams", function(done){

    var stream1 = new Kefir.Stream()              // 1
    var stream2 = new Kefir.Stream()              // -2-4
    var stream3 = new Kefir.Stream()              // --3-5
    var merged = stream1.merge(stream2, stream3); // 12345

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 5]);
      done();
    });

    stream1.__sendValue(1);
    stream1.__sendEnd();
    stream2.__sendValue(2);
    stream3.__sendValue(3);
    stream2.__sendValue(4);
    stream2.__sendEnd();
    stream3.__sendValue(5);
    stream3.__sendEnd();

  }, 1);


  it("3 properties end 1 stream", function(done){

    var prop1 = new Kefir.Property(null, null, "10"); // 1
    var prop2 = new Kefir.Property(null, null, "10"); // -2--5
    var prop3 = new Kefir.Property();                 // --3
    var stream1 = new Kefir.Stream();                 // ---4
    var merged = prop1.merge(prop2, prop3, stream1);  // 12345 (all initial ignored)

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 5]);
      done();
    });

    prop1.__sendValue(1);
    prop1.__sendEnd();
    prop2.__sendValue(2);
    prop3.__sendValue(3);
    prop3.__sendEnd();
    stream1.__sendValue(4);
    stream1.__sendEnd();
    prop2.__sendValue(5);
    prop2.__sendEnd();

  }, 1);


});
