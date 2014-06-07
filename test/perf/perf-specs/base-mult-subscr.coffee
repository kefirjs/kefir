require('../perf-helper.coffee').setupTest 'just stream, but with multiple listeners', {
  kefir: (stream) ->
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream
  bacon: (stream) ->
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream.onValue(->)
    stream
  rx: (stream) ->
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream.subscribe(->)
    stream
}
