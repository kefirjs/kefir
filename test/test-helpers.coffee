Kefir = require("../dist/kefir")
sinon = require('sinon')

exports.watch = (property) ->
  result = {
    values: []
    errors: []
    ended: false
  }
  property.watch 'value', (x) -> result.values.push(x)
  property.watch 'error', (e) -> result.errors.push(e)
  property.watch 'end', -> result.ended = true
  result

exports.send = (property, type, x) ->
  property.__send(type, x)
  property

exports.prop = (initialValue, initialError) ->
  prop = new Kefir.Property()
  if initialValue?
    prop.__send('value', initialValue)
  if initialError?
    prop.__send('error', initialError)
  prop

exports.withFakeTime = (cb) ->
  clock = sinon.useFakeTimers(10000)
  cb(clock)
  clock.restore()


beforeEach ->
  @addMatchers {
    toHasValue: (value) -> @actual.has('value') && @actual.get('value') == value
    toHasEqualValue: (value) -> @actual.has('value') && @env.equals_(@actual.get('value'), value)
    toHasError: (error) -> @actual.has('error') && @actual.get('error') == error
    toHasEqualError: (error) -> @actual.has('error') && @env.equals_(@actual.get('error'), error)
    toHasNoValue: -> !@actual.has('value')
    toHasNoError: -> !@actual.has('error')
    toBeEnded: -> @actual.has('end')
    toBeActive: -> @actual.isActive()
    toNotBeEnded: -> !@actual.has('end')
    toNotBeActive: -> !@actual.isActive()
  }

