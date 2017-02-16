import FlatMap from './flat-map';

export default function flatMapLatest(obs, fn, options) {
  if (typeof fn !== 'function') {
    options = fn;
    fn = undefined;
  }
  options = options === undefined ? {} : options;
  const { overlapping = false } = options;
  return new FlatMap(obs, fn, {concurLim: 1, drop: 'old', overlapping }).setName(obs, 'flatMapLatest');
}
