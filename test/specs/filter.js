var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".filter()", function(){

  function isEven(x){
    return x % 2 === 0;
  }

  it("stream.filter()", function(done){

    var stream = new Kefir.Stream();
    var filtered = stream.filter(isEven);

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendValue(5);
    stream.__sendEnd();

  }, 1);



  it("property.filter()", function(done){

    var prop = new Kefir.Property(null, null, 6);
    var filtered = prop.filter(isEven);

    expect(filtered).toEqual(jasmine.any(Kefir.Property));
    expect(filtered.hasCached()).toBe(true);
    expect(filtered.getCached()).toBe(6);

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([6, 2, 4]);
      done();
    });

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(5);
    prop.__sendEnd();

  }, 1);


  it("property.filter() with wrong initial", function(done){

    var prop = new Kefir.Property(null, null, 5);
    var filtered = prop.filter(isEven);

    expect(filtered).toEqual(jasmine.any(Kefir.Property));
    expect(filtered.hasCached()).toBe(false);
    expect(filtered.getCached()).toBe(Kefir.NOTHING);

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendValue(4);
    prop.__sendValue(5);
    prop.__sendEnd();

  }, 1);

});
