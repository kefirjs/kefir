var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("FlatMap:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([4, 2, Kefir.END], 100);
    var mapped = stream.flatMap(function(x){
      return helpers.sampleStream([x, x, Kefir.END], 20 * x);
    });

    // ---------4---------2
    //           -------4-------4
    //                     ---2---2
    // -----------------4-----2-4-2

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([4, 2, 4, 2]);
      done();
    });

  }, 400);


});
