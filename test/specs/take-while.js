var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".takeWhile()", function(){

  it("ok", function(done){

    var stream = new Kefir.Stream();
    var whileNot3 = stream.takeWhile(function(x){
      return x !== 3;
    });

    helpers.captureOutput(whileNot3, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

    stream.__sendAny(Kefir.bunch(1, 2, 3, 4, Kefir.END));

  }, 1);


});
