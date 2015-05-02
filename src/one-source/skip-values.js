import {createStream, createProperty} from '../patterns/one-source';

const mixin = {
  _handleValue() {}
};

export const SkipValuesStream = createStream('skipValues', mixin);
export const SkipValuesProperty = createProperty('skipValues', mixin);
