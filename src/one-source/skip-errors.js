import {createStream, createProperty} from '../patterns/one-source';

const mixin = {
  _handleError() {}
};

export const SkipErrorsStream = createStream('skipErrors', mixin);
export const SkipErrorsProperty = createProperty('skipErrors', mixin);
