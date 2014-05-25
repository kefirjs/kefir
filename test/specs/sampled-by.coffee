Kefir = require('../../dist/kefir.js')
helpers = require('../test-helpers')



describe ".sampledBy()", ->

  it "property.sampledBy(stream)", ->

    prop = new Kefir.Property()
    stream = new Kefir.Stream()

    sampled = prop.sampledBy(stream)

    expect(sampled).toEqual(jasmine.any(Kefir.Stream))

    result = helpers.getOutput(sampled)

    expect(result.xs).toEqual []

    stream.__sendValue(1)
    expect(result.xs).toEqual []

    prop.__sendValue(2)
    expect(result.xs).toEqual []

    stream.__sendValue(3)
    expect(result.xs).toEqual [2]

    stream.__sendValue(4)
    expect(result.xs).toEqual [2, 2]

    prop.__sendValue(5)
    expect(result.xs).toEqual [2, 2]

    stream.__sendValue(6)
    expect(result.xs).toEqual [2, 2, 5]

    stream.__sendEnd()
    expect(result).toEqual(
      ended: true
      xs: [2, 2, 5]
    )



  it "property.sampledBy(stream, fn)", ->

    prop = new Kefir.Property()
    stream = new Kefir.Stream()

    sampled = prop.sampledBy(stream, (a, b) -> a + b)

    expect(sampled).toEqual(jasmine.any(Kefir.Stream))

    result = helpers.getOutput(sampled)

    expect(result.xs).toEqual []

    stream.__sendValue(1)
    expect(result.xs).toEqual []

    prop.__sendValue(2)
    expect(result.xs).toEqual []

    stream.__sendValue(3)
    expect(result.xs).toEqual [5]

    stream.__sendValue(4)
    expect(result.xs).toEqual [5, 6]

    prop.__sendValue(5)
    expect(result.xs).toEqual [5, 6]

    stream.__sendValue(6)
    expect(result.xs).toEqual [5, 6, 11]

    stream.__sendEnd()
    expect(result).toEqual(
      ended: true
      xs: [5, 6, 11]
    )



  it "stream.sampledBy(property, fn)", ->

    prop = new Kefir.Property()
    stream = new Kefir.Stream()

    sampled = stream.sampledBy(prop, (a, b) -> a + b)

    expect(sampled).toEqual(jasmine.any(Kefir.Property))
    expect(sampled.hasCached()).toEqual(false)
    expect(sampled.getCached()).toEqual(Kefir.NOTHING)

    result = helpers.getOutput(sampled)

    expect(result.xs).toEqual []

    prop.__sendValue(1)
    expect(result.xs).toEqual []

    stream.__sendValue(2)
    expect(result.xs).toEqual []

    prop.__sendValue(3)
    expect(result.xs).toEqual [5]

    prop.__sendValue(4)
    expect(result.xs).toEqual [5, 6]

    stream.__sendValue(5)
    expect(result.xs).toEqual [5, 6]

    prop.__sendValue(6)
    expect(result.xs).toEqual [5, 6, 11]

    prop.__sendEnd()
    expect(result).toEqual(
      ended: true
      xs: [5, 6, 11]
    )





