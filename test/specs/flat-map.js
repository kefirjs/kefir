var Kefir = require('../../kefir.js');
var helpers = require('../test-helpers');



describe("FlatMap:", function(){

  it("works", function(done){

    var main = new Kefir.Bus;
    var mapped = main.flatMap(function(x){
      return x;
    });

    helpers.captureOutput(mapped, function(values){
      expect(values).toEqual([1, 2, 3, 4]);
      done();
    });

    // ---1---3
    //   ---2---4
    // ---1-2-3-4

    main.push(helpers.sampleStream([1, 3, Kefir.END], 20))

    setTimeout(function(){
      main.push(helpers.sampleStream([2, 4, Kefir.END], 20))
    }, 10)

    setTimeout(function(){
      main.end()
    }, 70)

  }, 100);


});
