var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("Combine:", function(){

  it("simple case", function(done){

    var stream1 = helpers.sampleStream([1, 3, Kefir.END], 15);
    var stream2 = helpers.sampleStream([6, 5, Kefir.END], 20);

    // --1--3
    // ---6---5
    // ---7-9-8

    var combined = stream1.combine(stream2, function(s1, s2){
      return s1 + s2;
    })

    helpers.captureOutput(combined, function(values){
      expect(values).toEqual([7, 9, 8]);
      done();
    });

  }, 100);


  it("with property", function(done){

    var stream1 = helpers.sampleStream([1, 3, Kefir.END], 15);
    var stream2 = helpers.sampleStream([6, 5, Kefir.END], 20).toProperty(0);

    // --1--3
    // 0--6---5
    // --17-9-8

    var combined = stream1.combine(stream2, function(s1, s2){
      return s1 + s2;
    })

    helpers.captureOutput(combined, function(values){
      expect(values).toEqual([1, 7, 9, 8]);
      done();
    });

  }, 100);



  it("with temporary all unsubscribed", function(done){

    var bus1 = new Kefir.Bus;
    var bus2 = new Kefir.Bus;
    var combined = bus1.combine(bus2, function(a, b) { return a + b });

    helpers.captureOutput(combined.take(2), function(values){
      expect(values).toEqual([3, 5]);
    });

    bus1.push(1)
    bus2.push(2) // 1 + 2 = 3
    bus1.push(3) // 3 + 2 = 5
    expect(bus1.hasSubscribers()).toBe(true);
    expect(bus2.hasSubscribers()).toBe(true);
    bus2.push(4) // 3 + 4 = 7
    expect(bus1.hasSubscribers()).toBe(false);
    expect(bus2.hasSubscribers()).toBe(false);


    helpers.captureOutput(combined, function(values){
      expect(values).toEqual([9, 11]);
      done();
    });

    bus1.push(5) // 5 + 4 = 9
    bus2.push(6) // 5 + 6 = 11
    bus1.end()
    bus2.end()


  }, 100);



});
