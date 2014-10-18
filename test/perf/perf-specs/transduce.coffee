helper = require '../perf-helper.coffee'
t = require 'transducers-js'

id = (x) -> x

helper.setupTest 'map(id)', {
  kefir: (stream) -> stream.map(id)
  kefirA: (stream) -> stream.transduce(t.map(id))
}

helper.setupTest 'map(id).map(id).map(id)', {
  kefir: (stream) -> stream.map(id).map(id).map(id)
  kefirA: (stream) -> stream.transduce(t.comp(t.map(id), t.map(id), t.map(id)))
}
