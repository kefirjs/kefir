var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".combine()", function(){

  it("2 streams", function(){

    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();

    // --1--3
    // ---6---5
    // ---7-9-8

    var combined = stream1.combine([stream2], function(s1, s2){
      return s1 + s2;
    })

    var result = helpers.getOutput(combined);

    stream1.__sendValue(1)
    stream2.__sendValue(6)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [7, 9, 8]
    });

  });


  it("stream and property", function(){

    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();
    var prop2 = stream2.toProperty(0);

    // --1--3
    // 0--6---5
    // --17-9-8

    var combined = stream1.combine([prop2], function(s1, s2){
      return s1 + s2;
    })

    var result = helpers.getOutput(combined);

    stream1.__sendValue(1)
    stream2.__sendValue(6)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [1, 7, 9, 8]
    });

  });



  it("4 streams", function(){

    var stream1 = new Kefir.Stream(); // --1---3
    var stream2 = new Kefir.Stream(); // ----2-------5
    var stream3 = new Kefir.Stream(); // 2-------1
    var stream4 = new Kefir.Stream(); // -4--------2
                                      // ----2-6-1-3-6

    var combined = stream1.combine([stream2, stream3, stream4], function(s1, s2, s3, s4){
      return (s1 + s2) * s3 - s4;
    })

    var result = helpers.getOutput(combined);

    stream3.__sendValue(2)
    stream4.__sendValue(4)
    stream1.__sendValue(1)
    stream2.__sendValue(2)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream3.__sendValue(1)
    stream3.__sendEnd()
    stream4.__sendValue(2)
    stream4.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [2, 6, 1, 3, 6]
    });

  });


  it("3 streams w/o fn", function(){

    var stream1 = new Kefir.Stream(); // --1---3
    var stream2 = new Kefir.Stream(); // ----2-------5
    var stream3 = new Kefir.Stream(); // 2-------1

    var combined = stream1.combine([stream2, stream3])

    var result = helpers.getOutput(combined);

    stream3.__sendValue(2)
    stream1.__sendValue(1)
    stream2.__sendValue(2)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream3.__sendValue(1)
    stream3.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(result).toEqual({
      ended: true,
      xs: [
        [1, 2, 2],
        [3, 2, 2],
        [3, 2, 1],
        [3, 5, 1]
      ]
    });

  });



  it("firstIn/lastOut", function(){

    var stream1 = new Kefir.Stream();
    var stream2 = new Kefir.Stream();
    var combined = stream1.combine([stream2], function(a, b) { return a + b });

    var result1 = helpers.getOutput(combined.take(2));

    stream1.__sendValue(1)
    stream2.__sendValue(2) // 1 + 2 = 3
    expect(stream1.__hasSubscribers('value')).toBe(true);
    expect(stream2.__hasSubscribers('value')).toBe(true);
    stream1.__sendValue(3) // 3 + 2 = 5
    expect(stream1.__hasSubscribers('value')).toBe(false);
    expect(stream2.__hasSubscribers('value')).toBe(false);
    stream2.__sendValue(4) // skipped

    var result2 = helpers.getOutput(combined);

    stream1.__sendValue(5) // 5 + 2 = 7
    stream2.__sendValue(6) // 5 + 6 = 11
    stream1.__sendEnd()
    stream2.__sendEnd()

    expect(result1).toEqual({
      ended: true,
      xs: [3, 5]
    });

    expect(result2).toEqual({
      ended: true,
      xs: [7, 11]
    });

  });



});
