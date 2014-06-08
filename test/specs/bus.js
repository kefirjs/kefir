var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Bus", function(){



  it(".push()", function() {

    var bus = Kefir.bus();

    bus.push('no subscribers – will not be delivered');

    var result = helpers.getOutput(bus);

    bus.push(1);
    bus.push(2);
    bus.end();

    expect(result).toEqual({ended: true, xs: [1, 2]});

  });




  it(".error()", function() {

    var bus = Kefir.bus();

    var result = helpers.getOutputAndErrors(bus);

    bus.push(1);
    bus.push(Kefir.error('e1'));
    bus.error('e2');

    expect(result).toEqual({ended: false, xs: [1], errors: ['e1', 'e2']});

  });




  it(".plug()", function() {

    var mainBus = Kefir.bus();
    var source1 = Kefir.bus();
    var source2 = Kefir.bus();

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

    var mainBus = Kefir.bus();
    var source = Kefir.bus();

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
