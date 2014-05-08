var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("Take while:", function(){

  it("works", function(done){

    var stream = helpers.sampleStream([1, 2, 3, 4, Kefir.END]);
    var filtered = stream.takeWhile(function(x){
      return x !== 3;
    })

    helpers.captureOutput(filtered, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

  }, 100);


});
