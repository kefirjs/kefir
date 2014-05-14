var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');


describe("Property:", function(){



  it("works", function(done) {

    var bus = new Kefir.Bus;
    var property = bus.toProperty();

    var result1 = []
    property.on(function(x){
      result1.push(x)
    })
    expect(result1).toEqual([]);

    bus.push(1);

    var result2 = []
    property.on(function(x){
      result2.push(x)
    })
    expect(result1).toEqual([1]);
    expect(result2).toEqual([1]);

    bus.push(2);
    bus.end();

    property.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([1, 2]);
      done()
    });

  }, 100);


  it("initial value works", function(done) {

    var bus = new Kefir.Bus;
    var property = bus.toProperty(1);

    var result1 = []
    property.on(function(x){
      result1.push(x)
    })
    expect(result1).toEqual([1]);

    bus.push(2);
    bus.end();

    property.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      done()
    });

  }, 100);


  it("changes", function(done) {

    var bus = new Kefir.Bus;
    var property = bus.toProperty(1);

    helpers.captureOutput(property, function(values){
      expect(values).toEqual([1, 2, 3]);
    });

    helpers.captureOutput(property.changes(), function(values){
      expect(values).toEqual([2, 3]);
      done();
    });

    bus.push(2);
    bus.push(3);
    bus.end();

  }, 100);



  it("property.toProperty()", function() {

    var bus = new Kefir.Bus;
    var property = bus.toProperty(1);

    expect(property.toProperty()).toBe(property);
    expect(function(){
      property.toProperty(2);
    }).toThrow();

  });




});
