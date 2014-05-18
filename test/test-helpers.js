var Kefir = require('../dist/kefir.js');

exports.getOutput = function(stream) {
  var result = {
    xs: [],
    ended: false
  };
  stream.onValue(function(x){
    result.xs.push(x);
  });
  stream.onEnd(function(){
    result.ended = true;
  })
  return result;
}
