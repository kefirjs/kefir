var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".map()", function(){

  function x2(a){
    return a * 2;
  }

  it("stream.map()", function(done){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2);

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendEnd();

  }, 1);


  it("property.map()", function(done){

    var prop = new Kefir.Property(null, null, 5);
    var mapped = prop.map(x2);

    expect(mapped).toEqual(jasmine.any(Kefir.Property));
    expect(mapped.hasCached()).toBe(true);
    expect(mapped.getCached()).toBe(10);

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([10, 2, 4]);
      done();
    });

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendEnd();

  }, 1);



  it("firstIn/lastOut", function(done){

    var stream = new Kefir.Stream();
    var mapped = stream.map(x2)

    helpers.captureOutput(mapped.take(2), function(values){
      expect(values).toEqual([2, 4]);
    });

    stream.__sendValue(1)
    expect(stream.__hasSubscribers('value')).toBe(true);
    stream.__sendValue(2)
    expect(stream.__hasSubscribers('value')).toBe(false);
    stream.__sendValue(3)

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([8, 10]);
      done();
    });

    stream.__sendValue(4)
    stream.__sendValue(5)
    stream.__sendEnd()

  }, 1);


});
