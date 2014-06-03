Kefir = require('../../../dist/kefir.js')
Bacon = require('baconjs')

require('../benchmark-helper.coffee').setupTest 'stream.flatMap (x) -> Lib.once(x)', {
  kefir: (stream) ->
    stream.flatMap (x) -> Kefir.once(x)
  bacon: (stream) ->
    stream.flatMap (x) -> Bacon.once(x)
  async: true
}
