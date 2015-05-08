const {inherit} = require('./utils/objects');
const Observable = require('./observable');


function Stream() {
  Observable.call(this);
}

inherit(Stream, Observable, {

  _name: 'stream',

  getType() {
    return 'stream';
  }

});

module.exports = Stream;
