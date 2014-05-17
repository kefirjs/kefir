var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.interval()", function(){

  it("works", function(done){

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = Kefir.interval(30, 2).take(2);
    var stream3 = Kefir.interval(45, 3).take(2);

    // -1----------
    // ---2---2----
    // -----3-----3
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 2, 3]);
      done();
    });

  }, 200);


});
