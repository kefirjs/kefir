var Kefir = require('../../src/kefir.js');
var helpers = require('../test-helpers');



describe("repeatedly:", function(){

  it("works", function(done){

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = Kefir.repeatedly(30, [2, 4]).take(5);
    var stream3 = Kefir.repeatedly(45, [3, 5]).take(1);

    // 1
    // ---2---4---2---4---2
    // -----3
    var merged = stream1.merge(stream2, stream3);

    helpers.captureOutput(merged, function(values){
      expect(values).toEqual([1, 2, 3, 4, 2, 4, 2]);
      done();
    });

  }, 200);


});
