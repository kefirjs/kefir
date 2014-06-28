Benchmark = require('benchmark')
Kefir = require('../../dist/kefir.js')
Bacon = require('baconjs')
Rx = require('rx')

Benchmark.options.maxTime = 1;
Benchmark.options.minSamples = 15;


noop = ->

buildKefir = (modify) ->
  property = new Kefir.Property()
  modify(property).on('value', noop)
  -> property.__send('value', 1)

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
  modify(stream.publish().refCount()).subscribe(noop)
  -> observer.onNext(1)


exports.setupTest = (title, options) ->
  console.log ""
  console.log "#{title}"
  console.log "----------------------------------------------------------------"

  suite = new Benchmark.Suite()

  if options.kefir
    suite.add('Kefir', buildKefir(options.kefir))

  if options.bacon
    suite.add('Bacon', buildBacon(options.bacon))

  if options.rx
    suite.add('RxJS', buildRx(options.rx))

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



