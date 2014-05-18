var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".take()", function(){

  it("ok", function(done){

    var stream = new Kefir.Stream();

    var take2 = stream.take(2);
    var take10 = stream.take(10);

    helpers.captureOutput(take2, function(values){
      expect(values).toEqual([1, 2]);
    });

    helpers.captureOutput(take10, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

    stream.__sendAny(Kefir.bunch(1, 2, 3, 4, Kefir.END));

  }, 1);


});
