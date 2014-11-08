Benchmark = require('benchmark')
Kefir = require('../../dist/kefir.js')
Bacon = require('baconjs')
Rx = require('rx')

Benchmark.options.maxTime = 3;
Benchmark.options.minSamples = 15;


noop = ->


getVal = ->
  foo: 1
  bar: -> @foo


buildKefir = (modify, _getVal=getVal) ->
  emitter = null
  property = Kefir.fromBinder (newEmitter) ->
    emitter = newEmitter
    null
  modify(property).onValue(noop)
  -> emitter.emit(_getVal())


buildBacon = (modify, _getVal=getVal) ->
  sink = null
  stream = new Bacon.EventStream (newSink) ->
    sink = newSink
  modify(stream).onValue(noop)
  -> sink(new Bacon.Next(-> _getVal()))


buildRx = (modify, _getVal=getVal) ->
  observer = null
  stream = Rx.Observable.create (newObserver) ->
    observer = newObserver
  modify(stream.publish().refCount()).subscribe(noop)
  -> observer.onNext(_getVal())


exports.setupTest = (title, options) ->
  console.log ""
  console.log "#{title}"
  console.log "----------------------------------------------------------------"

  suite = new Benchmark.Suite()

  if options.kefir
    suite.add('Kefir', buildKefir(options.kefir, options.getVal))

  if options.kefirA
    suite.add('Kefir A', buildKefir(options.kefirA, options.getVal))

  if options.kefirB
    suite.add('Kefir B', buildKefir(options.kefirB, options.getVal))

  if options.kefirC
    suite.add('Kefir C', buildKefir(options.kefirC, options.getVal))

  if options.bacon
    suite.add('Bacon', buildBacon(options.bacon, options.getVal))

  if options.rx
    suite.add('RxJS', buildRx(options.rx, options.getVal))

  suite.on 'cycle', (event) ->
    console.log String(event.target)

  suite.on 'complete', ->
    base = null
    results = []
    for result in this
      if base == null
        base = result.hz
      results.push("#{result.name} #{(result.hz / base).toFixed(2)}")
    console.log '-----------------------'
    console.log results.join('   ')
    console.log ''


  suite.run(async: !!options.async)



