var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');


describe("Base stream:", function(){

  it("onEnd(), offEnd() works", function(done) {

    var stream = helpers.sampleStream([]);

    setTimeout(function(){
      stream._send(Kefir.END);
    }, 0);

    var calls = 0;

    var unsubscriber = function(){
      calls += 10;
    }

    stream.onEnd(unsubscriber);
    stream.offEnd(unsubscriber);

    stream.onEnd(function(){
      calls++;
    });

    setTimeout(function(){
      // subscription after end
      stream.onEnd(function(){
        calls++;
      });
      expect(calls).toBe(2);
      done();
    }, 50);

  }, 100);


  it("no values after end", function(done) {

    var stream = helpers.sampleStream([1, 2, Kefir.END, 3, 4]);

    helpers.captureOutput(stream, function(values){
      expect(values).toEqual([1, 2]);
      done();
    });

  }, 100);


  it("stream deliver events to all subscribers", function(done) {

    var stream = helpers.sampleStream([1, 2, Kefir.END]);

    var result1 = [];
    stream.subscribe(function(value){
      result1.push(value);
    });

    var result2 = [];
    stream.subscribe(function(value){
      result2.push(value);
    });

    stream.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([1, 2]);
      done();
    });

  }, 100);

  it("stream do not deliver events to unsubscribers", function(done) {

    var stream = helpers.sampleStream([1, 2, Kefir.END]);

    var result1 = [];
    stream.subscribe(function(value){
      result1.push(value);
    });

    var result2 = [];
    var unsubscriber = function(value){
      result2.push(value);
    }
    stream.subscribe(unsubscriber);
    stream.unsubscribe(unsubscriber);

    stream.onEnd(function(){
      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([]);
      done();
    });

  }, 100);


});
