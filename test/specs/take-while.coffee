Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe '.takeWhile()', ->

  lessThan3 = (x) -> x < 3

  it 'should end when source ends', ->
    p = prop()
    tp = p.takeWhile(lessThan3)
    expect(tp).toNotBeEnded()
    send(p, 'end')
    expect(tp).toBeEnded()

  it 'should handle initial *value*', ->
    expect(  prop(1).takeWhile(lessThan3)  ).toHasValue(1)

  it 'should handle initial *error*', ->
    expect(  prop(null, 1).takeWhile(lessThan3)  ).toHasError(1)

  it 'should handle further *errors*', ->
    p = prop()
    state = watch(p.takeWhile(lessThan3))
    send(p, 'error', 1)
    send(p, 'error', 2)
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2,3],ended:false})

  it 'should activate/deactivate source property', ->
    p = prop()
    tp = p.takeWhile(lessThan3)
    expect(p).toNotBeActive()
    tp.on 'value', (f = ->)
    expect(p).toBeActive()
    tp.off 'value', f
    expect(p).toNotBeActive()

  it 'should take first n values then end', ->
    p = prop()
    state = watch(p.takeWhile(lessThan3))
    send(p, 'value', 1)
    send(p, 'value', 2)
    send(p, 'value', 3)
    expect(state).toEqual({values:[1,2],errors:[],ended:true})

  it 'if initial value not satisfies condition should end without any initial value', ->
    p = prop(10)
    tp = p.takeWhile(lessThan3)
    expect(tp).toBeEnded()
    expect(tp).toHasNoValue()





# // var Kefir = require('../../dist/kefir.js');
# // var helpers = require('../test-helpers');



# // describe(".takeWhile()", function(){

# //   it("ok", function(){

# //     var stream = new Kefir.Stream();
# //     var whileNot3 = stream.takeWhile(function(x){
# //       return x !== 3;
# //     });

# //     var result = helpers.getOutput(whileNot3);

# //     stream.__sendValue(1);
# //     stream.__sendValue(2);
# //     stream.__sendValue(3);
# //     stream.__sendValue(4);
# //     stream.__sendEnd();

# //     expect(result).toEqual({
# //       ended: true,
# //       xs: [1, 2]
# //     })

# //   });


# // });
