var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Property", function(){

  it("hasValue, getValue", function(){

    var prop = new Kefir.Property();

    expect(prop.hasValue()).toBe(false);
    expect(prop.getValue()).toBe(Kefir.NOTHING);

    prop.__sendValue(1)
    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(1);

    prop = new Kefir.Property(null, null, 2);

    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(2);

  });


  it("onValue", function(){

    var prop = new Kefir.Property(null, null, 'foo');

    var calls = 0;

    prop.onValue(function(x){
      expect(x).toBe('foo');
      calls++;
    })

    expect(calls).toBe(1);

  });


  it("onNewValue", function(){

    var log = [];
    var prop = new Kefir.Property(null, null, 'foo');

    prop.onNewValue(function(x){
      log.push(x);
    });

    prop.__sendValue(1);
    prop.__sendValue(2);

    expect(log).toEqual([1, 2]);

  });


  it("stream.toProperty()", function(){

    var stream = new Kefir.Stream();
    var prop = stream.toProperty();

    var log = [];
    prop.onValue(function(x){
      log.push(x);
    })

    expect(prop.hasValue()).toBe(false);
    expect(prop.getValue()).toBe(Kefir.NOTHING);
    expect(log).toEqual([]);

    stream.__sendValue(1);

    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(1);
    expect(log).toEqual([1]);

    stream.__sendValue(2);

    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(2);
    expect(log).toEqual([1, 2]);

    stream.__sendEnd();

    expect(prop.isEnded()).toBe(true);
    expect(prop.hasValue()).toBe(true);
    expect(prop.getValue()).toBe(2);


    // with initial

    var prop2 = stream.toProperty(5);

    expect(prop2.hasValue()).toBe(true);
    expect(prop2.getValue()).toBe(5);

  });



  it("property.toProperty()", function(){

    var prop = new Kefir.Property(null, null, 'foo');

    expect(prop.toProperty()).toBe(prop);


    // with initial

    var prop2 = prop.toProperty(5);

    expect(prop2.hasValue()).toBe(true);
    expect(prop2.getValue()).toBe(5);

  });


  it("stream.toProperty() and errors", function(){

    var stream = new Kefir.Stream();
    var prop = stream.toProperty();

    expect(stream.__subscribers.error).toBe(undefined);

    var result = helpers.getOutputAndErrors(prop);
    expect(stream.__subscribers.error.length > 0).toBe(true);

    stream.__sendValue(1);
    stream.__sendError('e1');
    stream.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: ['e1', 'e2']
    })

  });



  it("property.changes()", function(){

    var prop = new Kefir.Property(null, null, 'foo');
    var changesStream = prop.changes();

    expect(changesStream).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutput(changesStream);

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

    expect(result).toEqual({
      ended: true,
      xs: [1, 2, 3]
    })

  });


  it("property.changes() and errors", function(){

    var prop = new Kefir.Property(null, null, 'foo');
    var changesStream = prop.changes();

    expect(changesStream).toEqual(jasmine.any(Kefir.Stream));

    var result = helpers.getOutputAndErrors(changesStream);

    prop.__sendValue(1);
    prop.__sendError('e1');
    prop.__sendAny(Kefir.error('e2'));

    expect(result).toEqual({
      ended: false,
      xs: [1],
      errors: ['e1', 'e2']
    })

  });



});
