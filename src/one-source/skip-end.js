import {createStream, createProperty} from '../patterns/one-source';

const mixin = {
  _handleEnd() {}
};

export const SkipEndStream = createStream('skipEnd', mixin);
export const SkipEndProperty = createProperty('skipEnd', mixin);
