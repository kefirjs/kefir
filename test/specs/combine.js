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

});
