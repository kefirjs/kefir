Kefir = require("../dist/kefir")
sinon = require('sinon')

Kefir.dissableDeprecationWarnings();

exports.Kefir = Kefir


logItem = (event, isCurrent) ->
  if event.type == 'value'
    if isCurrent
      {current: event.value}
    else
      event.value
  else if event.type == 'error'
    if isCurrent
      {currentError: event.value}
    else
      {error: event.value}
  else
    if isCurrent
      '<end:current>'
    else
      '<end>'

exports.watch = (obs) ->
  log = []
  fn = (event) -> log.push(logItem event, isCurrent)
  unwatch = -> obs.offAny fn
  isCurrent = true
  obs.onAny fn
  isCurrent = false
  {log, unwatch}

exports.watchWithTime = (obs) ->
  startTime = new Date()
  log = []
  isCurrent = true
  obs.onAny (event) ->
    log.push([(new Date() - startTime), (logItem event, isCurrent)])
  isCurrent = false
  log


exports.send = (obs, events) ->
  for event in events
    if event == '<end>'
      obs._emitEnd()
    if (typeof event == 'object' && 'error' of event)
      obs._emitError(event.error)
    else
      obs._emitValue(event)
  obs


_activateHelper = ->

exports.activate = (obs) ->
  obs.onEnd _activateHelper
  obs

exports.deactivate = (obs) ->
  obs.offEnd _activateHelper
  obs


exports.prop = ->
  new Kefir.Property()

exports.stream = ->
  new Kefir.Stream()

exports.pool = ->
  new Kefir.Pool()


# This function changes timers' IDs so "simultaneous" timers are reversed
# Also sets createdAt to 0 so closk.tick will sort by ID
# FIXME:
#   1) Not sure how well it works with interval timers (setInterval), probably bad
#   2) We need to restore (unshake) them back somehow (after calling tick)
#   Hopefully we'll get a native implementation, and wont have to fix those
#   https://github.com/sinonjs/lolex/issues/24
shakeTimers = (clock) ->
  ids = Object.keys(clock.timers)
  timers = ids.map (id) -> clock.timers[id]

  # see https://github.com/sinonjs/lolex/blob/a93c8a9af05fb064ae5c2ad1bfc72874973167ee/src/lolex.js#L175-L209
  timers.sort (a, b) ->
    return -1 if (a.callAt < b.callAt)
    return 1 if (a.callAt > b.callAt)
    return -1 if (a.immediate && !b.immediate)
    return 1 if (!a.immediate && b.immediate)

    # Following two cheks are reversed
    return 1 if (a.createdAt < b.createdAt)
    return -1 if (a.createdAt > b.createdAt)
    return 1 if (a.id < b.id)
    return -1 if (a.id > b.id)

  ids.sort (a, b) -> a - b
  timers.forEach (timer, i) ->
    id = ids[i]
    timer.createdAt = 0
    timer.id = id
    clock.timers[id] = timer

exports.withFakeTime = (cb, reverseSimultaneous = false) ->
  clock = sinon.useFakeTimers(10000)
  tick = (t) ->
    if reverseSimultaneous
      shakeTimers(clock)
    clock.tick(t)
  cb(tick, clock)
  clock.restore()


exports.inBrowser = window? and document?

exports.withDOM = (cb) ->
  div = document.createElement('div')
  document.body.appendChild(div)
  cb(div)
  document.body.removeChild(div)



# see:
#   https://github.com/rpominov/kefir/issues/134
#   https://github.com/rpominov/kefir/pull/135
exports.shakyTimeTest = (testCb) ->

  it '[shaky time test: normal run]', ->
    expectToEmitOverShakyTime = (stream, expectedLog, cb, timeLimit) ->
      expect(stream).toEmitInTime(expectedLog, cb, timeLimit)
    testCb(expectToEmitOverShakyTime)

  it '[shaky time test: reverse run]', ->
    expectToEmitOverShakyTime = (stream, expectedLog, cb, timeLimit) ->
      expect(stream).toEmitInTime(expectedLog, cb, timeLimit, true)
    testCb(expectToEmitOverShakyTime)



beforeEach ->
  @addMatchers {
    toBeProperty: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Property"
      @actual instanceof Kefir.Property
    toBeStream: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Stream"
      @actual instanceof Kefir.Stream
    toBePool: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Pool"
      @actual instanceof Kefir.Pool

    toBeActive: -> @actual._active

    toEmit: (expectedLog, cb) ->
      {log, unwatch} = exports.watch(@actual)
      cb?()
      unwatch()
      @message = -> "Expected to emit #{jasmine.pp(expectedLog)}, actually emitted #{jasmine.pp(log)}"
      @env.equals_(expectedLog, log)

    errorsToFlow: (source) ->
      expectedLog = if @isNot then [] else [{error: -2}, {error: -3}]
      if (@actual instanceof Kefir.Property)
        exports.activate(@actual)
        exports.send(source, [{error: -1}])
        exports.deactivate(@actual)
        unless @isNot
          expectedLog.unshift({currentError: -1})
      else if (source instanceof Kefir.Property)
        exports.send(source, [{error: -1}])
        unless @isNot
          expectedLog.unshift({currentError: -1})
      {log, unwatch} = exports.watch(@actual)
      exports.send(source, [{error: -2}, {error: -3}])
      unwatch()
      if @isNot
        @message = -> "Expected errors not to flow (i.e. to emit [], actually emitted #{jasmine.pp(log)})"
        !@env.equals_(expectedLog, log)
      else
        @message = -> "Expected errors to flow (i.e. to emit #{jasmine.pp(expectedLog)}, actually emitted #{jasmine.pp(log)})"
        @env.equals_(expectedLog, log)

    toEmitInTime: (expectedLog, cb, timeLimit = 10000, reverseSimultaneous = false) ->
      log = null
      exports.withFakeTime (tick) =>
        log = exports.watchWithTime(@actual)
        cb?(tick)
        tick(timeLimit)
      , reverseSimultaneous
      @message = -> "Expected to emit #{jasmine.pp(expectedLog)}, actually emitted #{jasmine.pp(log)}"
      @env.equals_(expectedLog, log)

    toActivate: (obss...) ->

      orOp = (a, b) -> a || b
      andOp = (a, b) -> a && b

      notStr = (if @isNot then 'not ' else '')
      notNotStr = (if @isNot then '' else 'not ')

      tests = {}
      tests["some activated at start"] = true
      tests["some #{notNotStr}activated"] = true
      tests["some #{notNotStr}deactivated"] = true
      tests["some #{notNotStr}activated at second try"] = true
      tests["some #{notNotStr}deactivated at second try"] = true

      correctResults = {}
      correctResults["some activated at start"] = true
      correctResults["some #{notNotStr}activated"] = true
      correctResults["some #{notNotStr}deactivated"] = true
      correctResults["some #{notNotStr}activated at second try"] = true
      correctResults["some #{notNotStr}deactivated at second try"] = true

      if @isNot
        correctResults["some #{notNotStr}activated"] = false
        correctResults["some #{notNotStr}activated at second try"] = false

      check = (test, conditions) ->
        if correctResults[test] == true
          for condition in conditions
            if !condition
              tests[test] = false
              return
        else
          for condition in conditions
            if condition
              return
          tests[test] = false

      check("some activated at start", (!obs._active for obs in obss))

      exports.activate(@actual)
      check("some #{notNotStr}activated", (obs._active for obs in obss))

      exports.deactivate(@actual)
      check("some #{notNotStr}deactivated", (!obs._active for obs in obss))

      exports.activate(@actual)
      check("some #{notNotStr}activated at second try", (obs._active for obs in obss))

      exports.deactivate(@actual)
      check("some #{notNotStr}deactivated at second try", (!obs._active for obs in obss))

      @message = ->
        failedTest = (name for name of tests when tests[name] != correctResults[name]).join(', ')
        obssNames = (obs.toString() for obs in obss).join(', ')
        "Expected #{@actual.toString()} to #{notStr}activate: #{obssNames} (#{failedTest})"

      for name of tests
        if tests[name] != correctResults[name]
          return @isNot
      return !@isNot

  }
