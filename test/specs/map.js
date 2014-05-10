var Kefir = require('../../src/kefir.js');
var helpers = require('../test-helpers');



describe("Map:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, Kefir.END]);
    var mapped = stream.map(function(x){
      return x*2;
    })

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

  }, 100);


  it("produce Property from Property", function(done){

    var property = helpers.sampleStream([1, 2, Kefir.END]).toProperty(5);
    var mapped = property.map(function(x){
      return x*2;
    })

    expect(mapped instanceof Kefir.Property).toBe(true);
    expect(mapped.getCached()).toBe(10);

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([10, 2, 4]);
      done();
    });

  }, 100);



  it("with temporary all unsubscribed", function(done){

    var bus = new Kefir.Bus;
    var mapped = bus.map(function(x){
      return x*2;
    })

    helpers.captureOutput(mapped.take(2), function(values){
      expect(values).toEqual([2, 4]);
    });

    bus.push(1)
    bus.push(2)
    expect(bus.hasSubscribers()).toBe(true);
    bus.push(3)
    expect(bus.hasSubscribers()).toBe(false);

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([8, 10]);
      done();
    });

    bus.push(4)
    bus.push(5)
    bus.end()

  }, 100);


});
