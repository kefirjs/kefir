var Kefir = require('../../src/kefir.js');
var helpers = require('../test-helpers');


describe("Bus:", function(){



  it("push() works", function(done) {

    var bus = new Kefir.Bus;

    bus.push('no subscribers – will not be delivered');

    setTimeout(function(){
      bus.push(2);
      bus.end();
    }, 0);

    helpers.captureOutput(bus, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

    bus.push(1);

  }, 100);




  it("plug() works", function(done) {

    var mainBus = new Kefir.Bus;
    var source1 = new Kefir.Bus;
    var source2 = new Kefir.Bus;

    mainBus.plug(source1);

    source1.push('no subscribers – will not be delivered');

    setTimeout(function(){
      source2.push('not plugged – will not be delivered');
      source1.push(1);
      mainBus.plug(source2);
    }, 0);

    setTimeout(function(){
      source2.push(2);
      source1.push(3);
      source1.end();
    }, 0);

    setTimeout(function(){
      source2.push(4);
      mainBus.end();
    }, 0);

    helpers.captureOutput(mainBus, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

  }, 100);




  it("unplug() works", function(done) {

    var mainBus = new Kefir.Bus;
    var source = new Kefir.Bus;

    mainBus.plug(source);


    setTimeout(function(){
      source.push(1);
      mainBus.unplug(source);
    }, 0);

    setTimeout(function(){
      source.push(2);
      source.end();
      mainBus.end();
    }, 0);

    helpers.captureOutput(mainBus, function(values){
      expect(values).toEqual([1]);
      done();
    });

  }, 100);




});
