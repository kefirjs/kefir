var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Filter:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, 3, 4, Kefir.END]);
    var filtered = stream.filter(function(x){
      return x % 2 === 0;
    })

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

  }, 100);



  it("works with properties", function(done){

    var property = helpers.sampleStream([1, 2, 3, 4, Kefir.END]).toProperty(6);

    var filtered = property.filter(function(x){
      return x % 2 === 0;
    })

    expect(filtered instanceof Kefir.Property).toBe(true);
    expect(filtered.getCached()).toBe(6);

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([6, 2, 4]);
      done();
    });

  }, 100);



  it("works with properties 2", function(done){

    var property = helpers.sampleStream([1, 2, 3, 4, Kefir.END]).toProperty(5);

    var filtered = property.filter(function(x){
      return x % 2 === 0;
    })

    expect(filtered instanceof Kefir.Property).toBe(true);
    expect(filtered.hasCached()).toBe(false);

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([2, 4]);
      done();
    });

  }, 100);



});
