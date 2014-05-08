var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("No more:", function(){

  it("works", function(){

    var bus = new Kefir.Bus;

    var values = []
    bus.subscribe(function(x){
      values.push(x);
      if (x > 2) {
        return Kefir.NO_MORE;
      }
    });

    bus.push(1);
    bus.push(2);
    bus.push(3);
    bus.push(4);
    bus.push(5);

    expect(values).toEqual([1, 2, 3]);

  });


});
