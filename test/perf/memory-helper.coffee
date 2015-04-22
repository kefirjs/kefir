Kefir = require('../../dist/kefir.js')
Bacon = require('baconjs')
Rx = require('rx')


toMb = (x) -> ( x / 1024 / 1024 ).toFixed(2) + ' MiB'
toKb = (x) -> ( x / 1024 ).toFixed(2) + ' KiB'
noop = ->


__lastMemoryUsage = 0
begin = ->
  global.gc()
  __lastMemoryUsage = process.memoryUsage().heapUsed
end = (name) ->
  global.gc()
  process.memoryUsage().heapUsed - __lastMemoryUsage

createNObservable = (subscribe, n, generator) ->
  observables = new Array(n)

  begin()
  for obs, i in observables
    observables[i] = generator(i)
  withoutSubscr = end()

  begin()
  for obs in observables
    subscribe(obs)
  withSubscr = end()

  observables = null
  global.gc()

  [withoutSubscr/n, withSubscr/n]



# Just keeps references to listeners
fakeSource =
  listeners: []
  subscribe: (listener) ->
    @listeners.push listener
    return

  unsubscribe: (listener) ->
    index = @listeners.indexOf(listener)
    @listeners.splice index, 1  unless index is -1
    return



baseKefir = ->
  Kefir.stream (emitter) ->
    fakeSource.subscribe emitter.emit
    -> fakeSource.unsubscribe emitter.emit

baseRx = ->
  (
    new Rx.Observable.create (observer) ->
      send = (x) -> observer.onNext x
      fakeSource.subscribe send
      -> fakeSource.unsubscribe send
  ).publish().refCount()

baseBacon = ->
  new Bacon.EventStream (sink) ->
    fakeSource.subscribe sink
    -> fakeSource.unsubscribe sink



createGenerator = (transform, getBase, Lib, options) ->
  if options.provideBase
    base = getBase()
    (i) ->
      transform(base, Lib, i)
  else if options.provideBaseOnEach
    (i) ->
      base = getBase()
      transform(base, Lib, i)
  else if options.provideNBases
    bases = new Array(options.provideNBases)
    for obs, i in bases
      bases[i] = getBase()
    (i) ->
      transform(bases, Lib, i)
  else if options.provideNBasesOnEach
    bases = new Array(options.provideNBasesOnEach)
    (i) ->
      for obs, i in bases
        bases[i] = getBase()
      transform(bases, Lib, i)
  else
    (i) ->
      transform(Lib, i)

printResult = (name, result) ->
  plus =  (if result[1] > 0 then "+" else "")
  console.log "#{name}   w/o subscr. #{toKb(result[0])}   w/ subscr. #{plus}#{toKb(result[1])}   sum #{toKb(result[0] + result[1])} "


exports.setupSpec = (title, options) ->

  n = options.n or 1000

  console.log ''
  console.log "#{title} (#{n} samples)"
  console.log "----------------------------------------------------------------"

  results = {}

  if options.kefir
    generator = createGenerator(options.kefir, baseKefir, Kefir, options)
    sub = (s) -> s.onValue noop
    results['Kefir'] = createNObservable(sub, n, generator)
    printResult('Kefir', results['Kefir'])

  if options.bacon
    generator = createGenerator(options.bacon, baseBacon, Bacon, options)
    sub = (s) -> s.onValue noop
    results['Bacon'] = createNObservable(sub, n, generator)
    printResult('Bacon', results['Bacon'])

  if options.rx
    generator = createGenerator(options.rx, baseRx, Rx, options)
    sub = (s) -> s.subscribe noop
    results['Rx'] = createNObservable(sub, n, generator)
    printResult('Rx   ', results['Rx'])

  baseWO = null
  baseW = null
  baseSum = null
  resultStr = []
  for name, value of results
    if baseWO == null
      baseWO = value[0]
      baseW = value[1]
      baseSum = value[0] + value[1]
    resultStr.push "#{name} #{(value[0] / baseWO).toFixed(2)} #{(value[1] / baseW).toFixed(2)} #{((value[0] + value[1]) / baseSum).toFixed(2)}"
  console.log '-----------------------'
  console.log resultStr.join('    ')
  console.log ''




