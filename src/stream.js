import {inherit} from './utils/objects';
import Observable from './observable';


export default function Stream() {
  Observable.call(this);
}

inherit(Stream, Observable, {

  _name: 'stream',

  getType() {
    return 'stream';
  }

});
