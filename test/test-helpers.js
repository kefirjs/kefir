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



exports.getOutputAndErrors = function(stream) {
  var result = {
    xs: [],
    errors: [],
    ended: false
  };
  stream.onValue(function(x){
    result.xs.push(x);
  });
  stream.onError(function(e){
    result.errors.push(e);
  });
  stream.onEnd(function(){
    result.ended = true;
  })
  return result;
}
