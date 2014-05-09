var Kefir = require('../../src/kefir.js');
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


});
