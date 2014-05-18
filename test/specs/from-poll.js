var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.fromPoll()", function(){

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  function pollArray(values, interval){
    return Kefir.fromPoll(interval, function(){
      if (values.length > 0) {
        return values.shift();
      } else {
        return Kefir.END;
      }
    });
  }

  it("ok", function(){

    var stream = pollArray([1, 2, 3], 30);

    var log = [];
    stream.onValue(function(x){
      log.push(x);
    });

    expect(log).toEqual([]);

    jasmine.Clock.tick(10);
    expect(log).toEqual([]);

    jasmine.Clock.tick(21);
    expect(log).toEqual([1]);

    jasmine.Clock.tick(30);
    expect(log).toEqual([1, 2]);

    jasmine.Clock.tick(30);
    expect(log).toEqual([1, 2, 3]);

    jasmine.Clock.tick(30);
    expect(stream.isEnded()).toBe(true);
    expect(log).toEqual([1, 2, 3]);

  });


});
