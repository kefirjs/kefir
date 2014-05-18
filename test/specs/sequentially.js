var Kefir = require('../../dist/kefir.js');
var helpers = require('../test-helpers');



describe("Kefir.sequentially()", function(){

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it("ok", function(){

    var stream = Kefir.sequentially(30, [2, 4]);

    var result = helpers.getOutput(stream);

    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(10);
    expect(result.xs).toEqual([]);

    jasmine.Clock.tick(21);
    expect(result.xs).toEqual([2]);

    jasmine.Clock.tick(30);
    expect(result.xs).toEqual([2, 4]);
    expect(result.ended).toEqual(true);

  });


});
