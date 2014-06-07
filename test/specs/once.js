var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.once()", function(){

  it("ok", function(){

    var stream = Kefir.once(1);

    var log = [];

    expect(stream.isEnded()).toBe(false);

    stream.onValue(function(x){
      log.push(x);
    });

    expect(log).toEqual([1]);
    expect(stream.isEnded()).toBe(true);

    log = [];

    stream.onValue(function(x){
      log.push(x);
    });

    expect(log).toEqual([]);


  });


  it("onBoth", function(){

    var stream = Kefir.once(1);

    var log = [];

    expect(stream.isEnded()).toBe(false);

    stream.onBoth(function(type, x){
      log.push([type, x]);
    });

    expect(log).toEqual([['value', 1]]);
    expect(stream.isEnded()).toBe(true);

    log = [];

    stream.onBoth(function(type, x){
      log.push([type, x]);
    });

    stream.onValue(function(x){
      log.push(x);
    });

    expect(log).toEqual([]);


  });


});
