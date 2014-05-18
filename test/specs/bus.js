var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Bus", function(){



  it(".push()", function() {

    var bus = new Kefir.Bus();

    bus.push('no subscribers – will not be delivered');

    var result = helpers.getOutput(bus);

    bus.push(1);
    bus.push(2);
    bus.end();

    expect(result).toEqual({ended: true, xs: [1, 2]});

  });




  it(".plug()", function() {

    var mainBus = new Kefir.Bus();
    var source1 = new Kefir.Bus();
    var source2 = new Kefir.Bus();

    mainBus.plug(source1);

    source1.push('no subscribers – will not be delivered');

    var result = helpers.getOutput(mainBus);

    source2.push('not plugged – will not be delivered');
    source1.push(1);
    mainBus.plug(source2);

    source2.push(2);
    source1.push(3);
    source1.end();

    source2.push(4);
    mainBus.end();

    expect(result).toEqual({ended: true, xs: [1, 2, 3, 4]});

  });




  it(".unplug()", function() {

    var mainBus = new Kefir.Bus();
    var source = new Kefir.Bus();

    mainBus.plug(source);

    var result = helpers.getOutput(mainBus);

    source.push(1);
    mainBus.unplug(source);

    source.push(2);
    source.end();
    mainBus.end();

    expect(result).toEqual({ended: true, xs: [1]});

  });




});
