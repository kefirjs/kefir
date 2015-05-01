import Kefir from '../kefir';


Kefir.DEPRECATION_WARNINGS = true;
const canLog = (typeof console !== undefined) && console.log;

export default function deprecated(name, alt, fn) {
  return function() {
    if (Kefir.DEPRECATION_WARNINGS && canLog) {

      const message = `Method \`${name}\` is deprecated, and to be removed in v3.0.0.
Use \`${alt}\` instead.
To disable all warnings like this set \`Kefir.DEPRECATION_WARNINGS = false\`.`;

      console.log(message);
    }
    return fn.apply(this, arguments);
  };
}
