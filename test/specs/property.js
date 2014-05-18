var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Property", function(){

  it("hasCached, getCached", function(){

    var prop = new Kefir.Property();

    expect(prop.hasCached()).toBe(false);
    expect(prop.getCached()).toBe(Kefir.NOTHING);

    prop.__sendValue(1)
    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(1);

    prop = new Kefir.Property(null, null, 2);

    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(2);

  });


  it("onValue", function(done){

    var prop = new Kefir.Property(null, null, 'foo');

    prop.onValue(function(x){
      expect(x).toBe('foo');
      done();
    })

  }, 1);


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

    expect(prop.hasCached()).toBe(false);
    expect(prop.getCached()).toBe(Kefir.NOTHING);
    expect(log).toEqual([]);

    stream.__sendValue(1);

    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(1);
    expect(log).toEqual([1]);

    stream.__sendValue(2);

    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(2);
    expect(log).toEqual([1, 2]);

    stream.__sendEnd();

    expect(prop.isEnded()).toBe(true);
    expect(prop.hasCached()).toBe(true);
    expect(prop.getCached()).toBe(2);


    // with initial

    var prop2 = stream.toProperty(5);

    expect(prop2.hasCached()).toBe(true);
    expect(prop2.getCached()).toBe(5);

  });



  it("property.toProperty()", function(){

    var prop = new Kefir.Property(null, null, 'foo');

    expect(prop.toProperty()).toBe(prop);


    // with initial

    var prop2 = prop.toProperty(5);

    expect(prop2.hasCached()).toBe(true);
    expect(prop2.getCached()).toBe(5);

  });



  it("property.changes()", function(done){

    var prop = new Kefir.Property(null, null, 'foo');
    var changesStream = prop.changes();

    expect(changesStream).toEqual(jasmine.any(Kefir.Stream));

    helpers.captureOutput(changesStream, function(values){
      expect(values).toEqual([1, 2, 3]);
      done();
    });

    prop.__sendValue(1);
    prop.__sendValue(2);
    prop.__sendValue(3);
    prop.__sendEnd();

  }, 1);


});
