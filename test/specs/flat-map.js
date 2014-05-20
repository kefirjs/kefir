var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".flatMap()", function(){

  it("filter with once() and never()", function(){

    var stream = new Kefir.Stream();
    var mapped = stream.flatMap(function(x){
      if (x % 2 === 0) {
        return Kefir.once(x);
      } else {
        return Kefir.never();
      }
    });

    var result = helpers.getOutput(mapped);

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




  it("property.flatMap()", function(){

    var prop = new Kefir.Property(null, null, 1);
    var mapped = prop.flatMap(function(x){
      return Kefir.once(x * 2);
    });

    expect(mapped).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(mapped);

    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [2, 4, 6]
    });

  });



  it("multiple values from children", function(){

    var childStreams = [
      new Kefir.Stream(),
      new Kefir.Stream(),
      new Kefir.Stream()
    ]

    var stream = new Kefir.Stream();
    var mapped = stream.flatMap(function(x){
      return childStreams[x];
    });

    var result = helpers.getOutput(mapped);

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

    expect(result).toEqual({
      ended: false,
      xs: [1, 2, 3, 4, 4]
    });

    childStreams[0].__sendEnd()
    childStreams[1].__sendEnd()
    childStreams[2].__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3, 4, 4]
    });


  });


});
