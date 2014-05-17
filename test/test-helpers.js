var Kefir = require('../dist/kefir.js');

exports.captureOutput = function(stream, callback) {
  var values = [];

  function log(value){
    values.push(value);
  }

  function report(){
    callback(values);
  }

  stream.onValue(log);
  stream.onEnd(report);
}



exports.sampleStream = function(values, interval){
  interval = interval || 0;

  var intervalId = null;

  var stream = new Kefir.Stream(
    function(){
      intervalId = setInterval(function(){
        if (values.length > 0) {
          stream.__sendAny( values.shift() );
        }
      }, interval)
    },
    function(){
      clearInterval(intervalId);
      intervalId = null;
    }
  );

  return stream;
}
