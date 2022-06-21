const Kefir = require('../dist/kefir')
const {config, expect, use} = require('chai')
const chaiKefir = require('chai-kefir').default
const sinonChai = require('sinon-chai')

config.truncateThreshold = false

const {plugin, send, value, error, end, activate, deactivate, prop, stream, pool} = chaiKefir(Kefir)
use(sinonChai)
use(plugin)

use(({Assertion}, utils) => {
  Assertion.addMethod('activate', function assertActivate(...obss) {
    let obs
    const isNot = utils.flag(this, 'negate')
    const actual = utils.getActual(this, arguments)

    const notStr = isNot ? 'not ' : ''
    const notNotStr = isNot ? '' : 'not '

    const tests = {}
    tests['some activated at start'] = true
    tests[`some ${notNotStr}activated`] = true
    tests[`some ${notNotStr}deactivated`] = true
    tests[`some ${notNotStr}activated at second try`] = true
    tests[`some ${notNotStr}deactivated at second try`] = true

    const correctResults = {}
    correctResults['some activated at start'] = true
    correctResults[`some ${notNotStr}activated`] = true
    correctResults[`some ${notNotStr}deactivated`] = true
    correctResults[`some ${notNotStr}activated at second try`] = true
    correctResults[`some ${notNotStr}deactivated at second try`] = true

    if (isNot) {
      correctResults[`some ${notNotStr}activated`] = false
      correctResults[`some ${notNotStr}activated at second try`] = false
    }

    const check = (test, conditions) => {
      if (correctResults[test] === true) {
        for (let condition of conditions) {
          if (!condition) {
            tests[test] = false
            return
          }
        }
      } else {
        for (let condition of conditions) {
          if (condition) {
            return
          }
        }
        tests[test] = false
      }
    }

    check(
      'some activated at start',
      obss.map(obs => !obs._active)
    )

    activate(actual)
    check(
      `some ${notNotStr}activated`,
      obss.map(obs => obs._active)
    )

    deactivate(actual)
    check(
      `some ${notNotStr}deactivated`,
      obss.map(obs => !obs._active)
    )

    activate(actual)
    check(
      `some ${notNotStr}activated at second try`,
      obss.map(obs => obs._active)
    )

    deactivate(actual)
    check(
      `some ${notNotStr}deactivated at second try`,
      obss.map(obs => !obs._active)
    )

    const message = (() => {
      const failedTest = (() => {
        const result5 = []
        for (let name in tests) {
          if (tests[name] !== correctResults[name]) {
            result5.push(name)
          }
        }
        return result5
      })().join(', ')
      const obssNames = (() => {
        const result6 = []
        for (obs of obss) {
          result6.push(obs.toString())
        }
        return result6
      })().join(', ')
      return `Expected ${actual.toString()} to ${notStr}activate: ${obssNames} (${failedTest})`
    })()

    for (let name in tests) {
      if (tests[name] !== correctResults[name]) {
        this.assert(isNot, message, message)
        return
      }
    }

    this.assert(!isNot, message, message)
  })
})

Kefir.dissableDeprecationWarnings()

exports.Kefir = Kefir
exports.send = send
exports.activate = activate
exports.deactivate = deactivate
exports.prop = prop
exports.stream = stream
exports.pool = pool
exports.value = value
exports.error = error
exports.end = end

// see:
//   https://github.com/kefirjs/kefir/issues/134
//   https://github.com/kefirjs/kefir/pull/135
exports.shakyTimeTest = testCb => {
  it('[shaky time test: normal run]', () => {
    const expectToEmitOverShakyTime = (stream, expectedLog, cb, timeLimit) =>
      expect(stream).to.emitInTime(expectedLog, cb, {timeLimit})
    testCb(expectToEmitOverShakyTime)
  })

  it('[shaky time test: reverse run]', () => {
    const expectToEmitOverShakyTime = (stream, expectedLog, cb, timeLimit) =>
      expect(stream).to.emitInTime(expectedLog, cb, {
        timeLimit,
        reverseSimultaneous: true,
      })
    testCb(expectToEmitOverShakyTime)
  })
}

exports.expect = expect
