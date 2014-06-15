var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".takeWhile()", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();
    var whileNot3 = stream.takeWhile(function(x){
      return x !== 3;
    });

    var result = helpers.getOutput(whileNot3);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, 2]
    })

  });


});
