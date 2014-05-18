var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.never()", function(){

  it("ok", function(done){

    helpers.captureOutput(Kefir.never(), function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 1);


});
