module.exports = Date.now ?
  (() => Date.now()) :
  (() => new Date().getTime());
