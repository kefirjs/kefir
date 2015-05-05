const merge = require('../many-sources/merge');
const map = require('../one-source/map');
const skipDuplicates = require('../one-source/skip-duplicates');
const toProperty = require('../one-source/to-property');

const f = () => false;
const t = () => true;
const eq = (a, b) => a === b;

module.exports = function awaiting(a, b) {
  let result = merge([map(a, t), map(b, f)]);
  result = skipDuplicates(result, eq);
  result = toProperty(result, f);
  return result.setName(a, 'awaiting');
}
