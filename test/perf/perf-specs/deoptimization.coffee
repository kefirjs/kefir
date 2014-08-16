helper = require('../perf-helper.coffee')


randomObjectA = ->
  obj = {}
  obj[ Math.round(Math.random() * 100000000000000) ] = 1
  obj

randomObjectB = ->
  obj = {}
  obj[ Math.round(Math.random() * 1) ] = 1
  obj

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


