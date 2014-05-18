var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.once()", function(){

  it("ok", function(done){

    var stream = Kefir.once(1);

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([1]);
    });

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([]);
      done();
    });

  }, 1);


});
