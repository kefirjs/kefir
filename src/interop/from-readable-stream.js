const stream = require('../primary/stream');


module.exports = function fromReadableStream(readableStream) {
  return stream(function(emitter) {
    readableStream.on('data', emitter.emit);
    readableStream.on('error', emitter.error);
    readableStream.on('end', emitter.end);
    return function() {
      readableStream.removeListener('data', emitter.emit);
      readableStream.removeListener('error', emitter.error);
      readableStream.removeListener('end', emitter.end);
    }
  }).setName('fromReadableStream');
};
