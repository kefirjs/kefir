Kefir = require('../../dist/kefir.js')
helpers = require('../test-helpers')



describe "Kefir.onValues()", ->

  it "ok", ->

    stream1 = new Kefir.Stream() # --1---3
    stream2 = new Kefir.Stream() # ----2-------5
    stream3 = new Kefir.Stream() # 2-------1

    log = []

    Kefir.onValues [stream1, stream2, stream3], ->
      log.push [].slice.call(arguments)

    stream3.__sendValue(2)
    stream1.__sendValue(1)
    stream2.__sendValue(2)
    stream1.__sendValue(3)
    stream1.__sendEnd()
    stream3.__sendValue(1)
    stream3.__sendEnd()
    stream2.__sendValue(5)
    stream2.__sendEnd()

    expect(log).toEqual [
      [1, 2, 2]
      [3, 2, 2]
      [3, 2, 1]
      [3, 5, 1]
    ]



