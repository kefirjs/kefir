Benchmark = require('benchmark')
Kefir = require('../../dist/kefir.js')
Bacon = require('baconjs')
Rx = require('rx')

noop = ->

buildKefir = (modify) ->
  stream = new Kefir.Stream()
  modify(stream).onValue(noop)
  -> stream.__sendValue(1)

buildBacon = (modify) ->
  sink = null
  stream = new Bacon.EventStream (newSink) ->
    sink = newSink
  modify(stream).onValue(noop)
  -> sink(new Bacon.Next(-> 1))

buildRx = (modify) ->
  observer = null
  stream = Rx.Observable.create (newObserver) ->
    observer = newObserver
  modify(stream).subscribe(noop)
  -> observer.onNext(1)


exports.setupTest = (title, modifyFns) ->
  console.log "\n#{title}"
  console.log "----------------------------------------------------------------"

  suite = new Benchmark.Suite()

  if modifyFns.kefir
    suite.add('Kefir', buildKefir(modifyFns.kefir))

  if modifyFns.bacon
    suite.add('Bacon', buildBacon(modifyFns.bacon))

  if modifyFns.rx
    suite.add('RxJS', buildRx(modifyFns.rx))

  suite.on 'cycle', (event) ->
    console.log String(event.target)

  suite.run(async: false)



