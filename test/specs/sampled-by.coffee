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
    expect(sampled.hasValue()).toEqual(false)
    expect(sampled.getValue()).toEqual(Kefir.NOTHING)

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


  it "propert.sampledBy(property, fn) both has initial values", ->

    prop1 = new Kefir.Property(1)
    prop2 = new Kefir.Property(2)

    sampled = prop1.sampledBy(prop2, (a, b) -> a + b)

    expect(sampled).toEqual(jasmine.any(Kefir.Property))
    expect(sampled.hasValue()).toEqual(true)
    expect(sampled.getValue()).toEqual(3)

    result = helpers.getOutput(sampled)

    expect(result.xs).toEqual [3]




  it ".sampledBy() and errors", ->

    stream1 = new Kefir.Stream()
    stream2 = new Kefir.Stream()

    sampled = stream1.sampledBy(stream2)

    result = helpers.getOutputAndErrors(sampled)

    stream1.__sendError('e1-1')
    stream2.__sendError('e2-1')
    stream1.__sendError('e1-2')
    stream2.__sendError('e2-2')

    expect(result).toEqual(
      ended: false
      xs: []
      errors: ['e1-1', 'e2-1', 'e1-2', 'e2-2']
    )



