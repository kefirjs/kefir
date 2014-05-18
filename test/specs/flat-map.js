var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".flatMap()", function(){

  it("filter with once() and never()", function(done){

    var stream = new Kefir.Stream();
    var mapped = stream.flatMap(function(x){
      if (x % 2 === 0) {
        return Kefir.once(x);
      } else {
        return Kefir.never();
      }
    });

    helpers.captureOutput(mapped, function(values){
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




  it("property.flatMap()", function(done){

    var prop = new Kefir.Property(null, null, 1);
    var mapped = prop.flatMap(function(x){
      return Kefir.once(x * 2);
    });

    expect(mapped).toEqual(jasmine.any(Kefir.Stream));

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([2, 4, 6]);
      done();
    });

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

  }, 1);



  it("multiple values from children", function(done){

    var childStreams = [
      new Kefir.Stream(),
      new Kefir.Stream(),
      new Kefir.Stream()
    ]

    var stream = new Kefir.Stream();
    var mapped = stream.flatMap(function(x){
      return childStreams[x];
    });

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([1, 2, 3, 4, 4]);
      done();
    });

    stream.__sendValue(2);
    childStreams[0].__sendValue("not delivered");
    childStreams[2].__sendValue(1);
    stream.__sendValue(0);
    childStreams[0].__sendValue(2);
    stream.__sendValue(1);
    childStreams[1].__sendValue(3);
    stream.__sendValue(1);
    childStreams[1].__sendValue(4);
    stream.__sendEnd();


  });


});
