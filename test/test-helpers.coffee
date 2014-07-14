Kefir = require("../dist/kefir")
sinon = require('sinon')

exports.watch = (property) ->
  result = {
    values: []
    errors: []
  }
  property.watch 'value', (x) -> result.values.push(x)
  property.watch 'error', (e) -> result.errors.push(e)
  property.watch 'end', (x) -> result.end = x
  result

exports.send = (property, type, x) ->
  property._send(type, x)
  property

exports.activate = (property) ->
  property.on 'end', ->
  property

exports.prop = (initialValue, initialError, initialEnd) ->
  prop = new Kefir.Property()
  if initialValue?
    prop._send('value', initialValue)
  if initialError?
    prop._send('error', initialError)
  if initialEnd?
    prop._send('end', initialEnd)
  prop

exports.withFakeTime = (cb) ->
  clock = sinon.useFakeTimers(10000)
  cb(clock)
  clock.restore()


exports.inBrowser = window? and document?

exports.withDOM = (cb) ->
  div = document.createElement('div')
  document.body.appendChild(div)
  cd(div)
  document.body.removeChild(div)



beforeEach ->
  @addMatchers {
    toHasValue: (value) -> @actual.has('value') && @actual.get('value') == value
    toHasEqualValue: (value) -> @actual.has('value') && @env.equals_(@actual.get('value'), value)
    toHasError: (error) -> @actual.has('error') && @actual.get('error') == error
    toHasEqualError: (error) -> @actual.has('error') && @env.equals_(@actual.get('error'), error)
    toHasEnd: (end) -> @actual.has('end') && @actual.get('end') == end
    toHasEqualEnd: (end) -> @actual.has('end') && @env.equals_(@actual.get('end'), end)
    toHasNoValue: -> !@actual.has('value')
    toHasNoError: -> !@actual.has('error')
    toHasNoEnd: -> !@actual.has('end')
    toBeActive: -> @actual.isActive()
    toNotBeActive: -> !@actual.isActive()

    # deprecated
    toNotBeEnded: -> !@actual.has('end')
    toBeEnded: -> @actual.has('end')
  }

