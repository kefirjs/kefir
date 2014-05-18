var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Bus", function(){



  it(".push()", function(done) {

    var bus = new Kefir.Bus();

    bus.push('no subscribers – will not be delivered');

    helpers.captureOutput(bus, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

    bus.push(1);
    bus.push(2);
    bus.end();

  }, 1);




  it(".plug()", function(done) {

    var mainBus = new Kefir.Bus();
    var source1 = new Kefir.Bus();
    var source2 = new Kefir.Bus();

    mainBus.plug(source1);

    source1.push('no subscribers – will not be delivered');

    helpers.captureOutput(mainBus, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

    source2.push('not plugged – will not be delivered');
    source1.push(1);
    mainBus.plug(source2);

    source2.push(2);
    source1.push(3);
    source1.end();

    source2.push(4);
    mainBus.end();

  }, 1);




  it(".unplug()", function(done) {

    var mainBus = new Kefir.Bus();
    var source = new Kefir.Bus();

    mainBus.plug(source);

    helpers.captureOutput(mainBus, function(values){
      expect(values).toEqual([1]);
      done();
    });

    source.push(1);
    mainBus.unplug(source);

    source.push(2);
    source.end();
    mainBus.end();

  }, 1);




});
