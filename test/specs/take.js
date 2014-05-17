var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".take()", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, 3, 4, Kefir.END]);

    var first2 = stream.take(2);
    var first10 = stream.take(10);

    helpers.captureOutput(first2, function(values){
      expect(values).toEqual([1, 2]);
    });

    helpers.captureOutput(first10, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

  }, 100);


});
