var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Kefir.fromBinder()", function(){



  it("subscribe/unsubscibe", function() {

    var log = [];
    var obs = Kefir.fromBinder(function(send){
      log.push('in');
      return function(){
        log.push('out');
      }
    });

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



  it("send", function() {

    var __send;

    var obs = Kefir.fromBinder(function(send){
      __send = send;
      return function(){};
    });

    var result = helpers.getOutputAndErrors(obs);

    __send(1);
    __send(2);
    __send(Kefir.error('e1'));
    __send(Kefir.NOTHING);
    __send(Kefir.END);


    expect(result).toEqual({
      ended: true,
      xs: [1, 2],
      errors: ['e1']
    });

  });




  it("with context and args", function() {

    var context = {
      send: null
    }

    var obs = Kefir.fromBinder(function(a, b, send){
      context.send = send;
      context.a = a;
      context.b = b;
    }, context, 'a', 'b');

    var result = helpers.getOutputAndErrors(obs);

    expect(context.send).toEqual(jasmine.any(Function))
    expect(context.a).toBe('a')
    expect(context.b).toBe('b')

    context.send(1);

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: []
    });

  });






});
