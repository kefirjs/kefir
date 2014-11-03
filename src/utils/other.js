var NOTHING = ['<nothing>'];

function agrsToArray(args) {
  if (args.length === 1 && isArray(args[0])) {
    return args[0];
  }
  return cloneArray(args);
}

var now = Date.now ?
  function() { return Date.now() } :
  function() { return new Date().getTime() };
