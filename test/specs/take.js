var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".take()", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();

    var take2 = stream.take(2);
    var take10 = stream.take(10);

    var result2 = helpers.getOutput(take2);

    var result10 = helpers.getOutput(take10);

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);
    stream.__sendValue(4);
    stream.__sendEnd();

    expect(result2).toEqual({
      ended: true,
      xs: [1, 2]
    })

    expect(result10).toEqual({
      ended: true,
      xs: [1, 2, 3, 4]
    })

  });


});
