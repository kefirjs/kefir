helper = require('../perf-helper.coffee')


randomObjectA = ->
  obj = {}
  obj[ Math.round(Math.random() * 100000000000000) ] = 1
  obj

randomObjectB = ->
  obj = {}
  obj[ Math.round(Math.random() * 1) ] = 1
  obj

class Wrap
  constructor: (x) ->
    @get = -> x

randomObjectAWr = -> new Wrap(randomObjectA())
randomObjectBWr = -> new Wrap(randomObjectB())



# running unwrapped version affects results of wrapped case

helper.setupTest 'not so random object', {
  kefir: (stream) -> stream.map(randomObjectB)
  bacon: (stream) -> stream.map(randomObjectB)
  rx: (stream) -> stream.map(randomObjectB)
}

helper.setupTest 'random object', {
  kefir: (stream) -> stream.map(randomObjectA)
  bacon: (stream) -> stream.map(randomObjectA)
  rx: (stream) -> stream.map(randomObjectA)
}



# helper.setupTest 'not so random object (wrapped)', {
#   kefir: (stream) -> stream.map(randomObjectBWr)
#   bacon: (stream) -> stream.map(randomObjectBWr)
#   rx: (stream) -> stream.map(randomObjectBWr)
# }

# helper.setupTest 'random object (wrapped)', {
#   kefir: (stream) -> stream.map(randomObjectAWr)
#   bacon: (stream) -> stream.map(randomObjectAWr)
#   rx: (stream) -> stream.map(randomObjectAWr)
# }


