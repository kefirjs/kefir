require('../perf-helper.coffee').setupTest 'just stream, but with multiple listeners', {
  kefir: (prop) ->
    prop.on('value', ->)
    prop.on('value', ->)
    prop.on('value', ->)
    prop.on('value', ->)
    prop.on('value', ->)
    prop.on('value', ->)
    prop
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
