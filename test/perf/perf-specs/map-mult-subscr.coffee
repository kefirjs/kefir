id = (x) -> x

require('../perf-helper.coffee').setupTest 'stream.map(id) with multiple listeners', {
  kefir: (stream) ->
    stream = stream.map(id)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream
  bacon: (stream) ->
    stream = stream.map(id)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream
  rx: (stream) ->
    stream = stream.map(id)
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream
}
