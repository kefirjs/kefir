var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.never()", function(){

  it("ok", function(){

    var stream = Kefir.never();

    expect(stream.isEnded()).toBe(true);

    var valueCall = 0;
    var endCall = 0;

    stream.onValue(function(){
      valueCall++;
    });

    stream.onBoth(function(){
      valueCall++;
    });

    stream.onEnd(function(){
      endCall++;
    });

    expect(valueCall).toBe(0);
    expect(endCall).toBe(1);


  });


});
