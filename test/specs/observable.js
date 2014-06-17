var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Observable/Stream", function(){

  it("onFirstIn/onLastOut", function(){

    var log = [];
    var obs = new Kefir.Observable()

    obs.__onFirstIn = function(){ log.push('in') }
    obs.__onLastOut = function(){ log.push('out') }

    var subscriber1 = function(){}
    var subscriber2 = function(){}

    expect(log).toEqual([]);

    obs.onValue(subscriber1);
    expect(log).toEqual(['in']);

    obs.onValue(subscriber2);
    expect(log).toEqual(['in']);

    obs.offValue(subscriber1);
    expect(log).toEqual(['in']);

    obs.offValue(subscriber2);
    expect(log).toEqual(['in', 'out']);

    obs.onValue(subscriber1);
    expect(log).toEqual(['in', 'out', 'in']);

    obs.offValue(subscriber1);
    expect(log).toEqual(['in', 'out', 'in', 'out']);

  });



  it("onValue/offValue", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(x){  log.push(x)  }

    obs.__sendValue(1);
    expect(log).toEqual([]);

    obs.onValue(subscriber);
    expect(log).toEqual([]);

    obs.__sendValue(2);
    expect(log).toEqual([2]);

    obs.__sendValue(3);
    expect(log).toEqual([2, 3]);

    obs.offValue(subscriber);
    obs.__sendValue(4);
    expect(log).toEqual([2, 3]);

    obs.onValue(subscriber);
    expect(log).toEqual([2, 3]);

    obs.__sendValue(5);
    expect(log).toEqual([2, 3, 5]);


  });


  it("onEnd/offEnd, isEnded", function(){

    var callCount = 0;
    var obs = new Kefir.Observable();

    var subscriber1 = function(x){  callCount++;  }
    var subscriber2 = function(x){  callCount++;  }

    obs.onEnd(subscriber1);
    obs.onEnd(subscriber2);

    expect(callCount).toBe(0);
    expect(obs.isEnded()).toBe(false);

    obs.offEnd(subscriber2);

    obs.__sendEnd();
    expect(callCount).toBe(1);
    expect(obs.isEnded()).toBe(true);

    obs.onEnd(subscriber2);
    expect(callCount).toBe(2);

  });



  it("subscribers with context and args", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(){
      log.push( [this].concat([].slice.call(arguments)) );
    }

    obs.onValue(subscriber, "foo", 1, 2);
    obs.onValue(subscriber, "bar", 3, 4);
    obs.onEnd(subscriber, "end", 5, 6);

    obs.__sendValue(1);
    expect(log).toEqual([
      ["foo", 1, 2, 1],
      ["bar", 3, 4, 1]
    ]);

    obs.offValue(subscriber, "bar", 3, 4);

    obs.__sendValue(2);
    expect(log).toEqual([
      ["foo", 1, 2, 1],
      ["bar", 3, 4, 1],
      ["foo", 1, 2, 2]
    ]);

    obs.__sendEnd()
    expect(log).toEqual([
      ["foo", 1, 2, 1],
      ["bar", 3, 4, 1],
      ["foo", 1, 2, 2],
      ["end", 5, 6]
    ]);

  });


  it("subscribers with string as fn and context", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(){
      log.push( [this.name].concat([].slice.call(arguments)) );
    }

    var context = {
      foo: subscriber,
      name: "bar"
    };

    obs.onValue("foo", context, 1, 2);

    obs.__sendValue(1);
    obs.__sendValue(2);

    expect(log).toEqual([
      ["bar", 1, 2, 1],
      ["bar", 1, 2, 2]
    ]);

  });


  it("send after end", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(x){  log.push(x)  }

    obs.onValue(subscriber);
    expect(log).toEqual([]);

    obs.__sendEnd();
    obs.__sendValue(1);
    expect(log).toEqual([]);

  });


  it("errors", function(){

    var obs = new Kefir.Observable();

    var result = helpers.getOutputAndErrors(obs);

    obs.__sendValue(1);
    obs.__sendError('e1');
    obs.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: ['e1', 'e2']
    });

  });



  it("__sendAny", function(){

    var obs = new Kefir.Observable();

    var result = helpers.getOutput(obs);

    obs.__sendValue(1);
    obs.__sendAny(2);
    obs.__sendAny(Kefir.NOTHING);
    obs.__sendAny(Kefir.END);

    expect(result).toEqual({
      ended: true,
      xs: [1, 2]
    });

  });



  it("onBoth/offBoth", function(){

    var log = [];
    var obs = new Kefir.Observable();

    var subscriber = function(type, x){  log.push([type, x])  }

    obs.__sendValue(1);
    expect(log).toEqual([]);

    obs.onBoth(subscriber);
    expect(log).toEqual([]);

    obs.__sendValue(2);
    expect(log).toEqual([['value', 2]]);

    obs.__sendError(3);
    expect(log).toEqual([['value', 2], ['error', 3]]);

    obs.offBoth(subscriber);
    obs.__sendValue(4);
    expect(log).toEqual([['value', 2], ['error', 3]]);

    obs.onBoth(subscriber);
    expect(log).toEqual([['value', 2], ['error', 3]]);

    obs.__sendValue(5);
    expect(log).toEqual([['value', 2], ['error', 3], ['value', 5]]);


  });


});
