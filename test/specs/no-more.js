var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.NO_MORE", function(){

  it("ok", function(){

    var stream = new Kefir.Stream();

    var values = []
    stream.onValue(function(x){
      values.push(x);
      if (x > 2) {
        return Kefir.NO_MORE;
      }
    });

    stream.__sendValue(1);
    stream.__sendValue(2);
    stream.__sendValue(3);

    expect(stream.active).toBe(false);

    stream.__sendValue(4);
    stream.__sendValue(5);

    expect(values).toEqual([1, 2, 3]);

  });


});
