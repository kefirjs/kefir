var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe(".skip()", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();

    var skip2 = stream.skip(2);
    var skip10 = stream.skip(10);

    var result2 = helpers.getOutput(skip2);

    var result10 = helpers.getOutput(skip10);

    stream.__sendAny(Kefir.bunch(1, 2, 3, 4, Kefir.END));

    expect(result2).toEqual({
      ended: true,
      xs: [3, 4]
    })

    expect(result10).toEqual({
      ended: true,
      xs: []
    })

  });


});
