var Kefir = require('../../src/kefir.js');
var helpers = require('../test-helpers');



describe("Once:", function(){

  it("works", function(done){

    var stream = Kefir.once(1);

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([1]);
    });

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 100);


});
