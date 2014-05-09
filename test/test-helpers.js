var Kefir = require('../src/kefir.js');

exports.captureOutput = function(stream, callback, timeout) {
  var values = [];

  function log(value){
    values.push(value);
  }

  function report(){
    stream.off(log);
    stream.offEnd(report);
    callback(values);
  }

  stream.on(log);
  stream.onEnd(report);

  if (typeof timeout === "number") {
    setTimeout(report, timeout);
  }
}



exports.sampleStream = function(values, timeout){
  timeout = timeout || 0;
  return Kefir.fromBinder(function(sink){
    var send = function() {
      if (values.length > 0) {
        sink(values.shift());
        setTimeout(send, timeout);
      }
    }
    setTimeout(send, timeout);
    return function(){};
  });
}
