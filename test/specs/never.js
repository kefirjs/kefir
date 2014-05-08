var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("Never:", function(){

  it("works", function(done){

    helpers.captureOutput(Kefir.never(), function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 100);


});
