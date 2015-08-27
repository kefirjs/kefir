Kefir = require("../dist/kefir")
sinon = require('sinon')
Combinatorics = require('js-combinatorics')

Kefir.DEPRECATION_WARNINGS = false;

exports.Kefir = Kefir


logItem = (event) ->
  if event.type == 'value'
    if event.current
      {current: event.value}
    else
      event.value
  else if event.type == 'error'
    if event.current
      {currentError: event.value}
    else
      {error: event.value}
  else
    if event.current
      '<end:current>'
    else
      '<end>'

exports.watch = (obs) ->
  log = []
  fn = (event) ->
    log.push(logItem event)
  unwatch = ->
    obs.offAny fn
  obs.onAny fn
  {log, unwatch}

exports.watchWithTime = (obs) ->
  startTime = new Date()
  log = []
  obs.onAny (event) ->
    log.push([(new Date() - startTime), (logItem event)])
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

# This will run the callback timeoutCount^timeoutCount times. Each time, the
# callback will be expected to call setTimeout exactly timeoutCount times. The
# setTimeout callbacks may be scheduled as normal, or with an up to
# timeoutCount-1 extra delay added. This will test all combinations. This is to
# test compatibility with browser bugs that reorder setTimeout callbacks. See
# https://github.com/rpominov/kefir/issues/134 for more information.
exports.shakyTimeTest = (timeoutCount, cb) ->
  delayValues = [0..timeoutCount-1]
  Combinatorics.baseN(delayValues, timeoutCount).forEach (order) =>
    expectToEmitOverShakyTime = (stream, expectedLog, cb, timeLimit = 10000) =>
      log = null
      exports.withFakeTime (tick) =>
        originalST = global.setTimeout
        global.setTimeout = sinon.spy ->
          delay = order.shift()
          if delay == 0
            originalST.apply this, arguments
          else
            _arguments = arguments
            originalST =>
              originalST.apply this, _arguments
            , delay
        log = exports.watchWithTime(stream)
        cb?(tick)
        tick(timeLimit)
        expect(global.setTimeout.callCount).toBe(timeoutCount)
        global.setTimeout = originalST
      expect(log.map ([time, value]) -> value).toEqual(expectedLog)
    cb expectToEmitOverShakyTime

exports.withFakeTime = (cb) ->
  clock = sinon.useFakeTimers(10000)
  cb(  (t) -> clock.tick(t)  )
  clock.restore()


exports.inBrowser = window? and document?

exports.withDOM = (cb) ->
  div = document.createElement('div')
  document.body.appendChild(div)
  cb(div)
  document.body.removeChild(div)




beforeEach ->
  @addMatchers {
    toBeProperty: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Property"
      @actual instanceof Kefir.Property
    toBeStream: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Stream"
      @actual instanceof Kefir.Stream
    toBeEmitter: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Emitter"
      @actual instanceof Kefir.Emitter
    toBePool: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Pool"
      @actual instanceof Kefir.Pool
    toBeBus: ->
      @message = -> "Expected #{@actual.toString()} to be instance of Bus"
      @actual instanceof Kefir.Bus

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

    toEmitInTime: (expectedLog, cb, timeLimit = 10000) ->
      log = null
      exports.withFakeTime (tick) =>
        log = exports.watchWithTime(@actual)
        cb?(tick)
        tick(timeLimit)
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
