var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');
var sinon = require('sinon');



describe("Kefir.fromPoll()", function(){

  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
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

    clock.tick(10);
    expect(log).toEqual([]);

    clock.tick(21);
    expect(log).toEqual([1]);

    clock.tick(30);
    expect(log).toEqual([1, 2]);

    clock.tick(30);
    expect(log).toEqual([1, 2, 3]);

    clock.tick(30);
    expect(stream.isEnded()).toBe(true);
    expect(log).toEqual([1, 2, 3]);

  });


});
