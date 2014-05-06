var Kefir = require('../kefir.js');

exports.captureOutput = function(stream, callback, timeout) {
  var values = [];

  function log(value){
    values.push(value);
  }

  function report(){
    stream.unsubscribe(log);
    stream.offEnd(report);
    callback(values);
  }

  stream.subscribe(log);
  stream.onEnd(report);

  if (typeof timeout === "number") {
    setTimeout(report, timeout);
  }
}



exports.sampleStream = function(values, timeout){
  timeout = timeout || 0;
  values.reverse();
  return Kefir.fromBinder(function(sink){
    var send = function() {
      if (values.length > 0) {
        sink(values.pop());
        setTimeout(send, timeout);
      }
    }
    setTimeout(send, timeout);
    return function(){};
  });
}
