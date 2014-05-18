var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.sequentially()", function(){

  it("ok", function(done){

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = Kefir.sequentially(30, [2, 4]);
    var stream3 = Kefir.sequentially(45, [3, 5]);

    // -1----------
    // ---2---4----
    // -----3-----5
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 5]);
      done();
    });

  }, 200);


});
