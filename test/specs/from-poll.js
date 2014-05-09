var Kefir = require('../../src/kefir.js');
var helpers = require('../test-helpers');



describe("FromPoll:", function(){

  it("works", function(done){

    function pollArray(values, interval){
      values = values.reverse();
      return Kefir.fromPoll(interval, function(){
        if (values.length > 0) {
          return values.pop();
        } else {
          return Kefir.END;
        }
      })
    }

    var stream1 = helpers.sampleStream([1, Kefir.END]);
    var stream2 = pollArray([2, 4], 30);
    var stream3 = pollArray([3, 5], 45);

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
