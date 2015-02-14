# build-dependencies: startwith, scheduled, filter

describe "EventStream.holdWhen", ->
  describe "Keeps events on hold when a property is true", ->
    expectStreamTimings(
      ->
        src = series(2, [1,2,3,4])
        valve = series(2, [true, false, true, false]).delay(1).toProperty()
        src.holdWhen(valve)
      [[2, 1], [5, 2], [6, 3], [9, 4]])
  describe "Holds forever when the property ends with truthy value", ->
    expectStreamTimings(
      ->
        src = series(2, [1,2,3,4])
        valve = series(2, [true, false, true]).delay(1).toProperty()
        src.holdWhen(valve)
      [[2, 1], [5, 2], [6, 3]])
  describe "Supports truthy init value for property", ->
    expectStreamTimings(
      ->
        src = series(2, [1,2])
        valve = series(2, [false]).delay(1).toProperty(true)
        src.holdWhen(valve)
      [[3, 1], [4, 2]])
  describe "Works with array values", -> 
    expectStreamEvents(
      ->
        Bacon.interval(1000, [1,2]).
          holdWhen(Bacon.later(1000, false).startWith(true)).
            take(1)
      [[1, 2]])

  describe.skip "Doesn't crash when flushing huge buffers", ->
    count = 6000
    expectPropertyEvents(
      ->
        source = series(1, [1..count])
        flag = source.map((x) -> x != count-1).toProperty(true)
        source.holdWhen(flag).fold(0, ((x,y) -> x+1), { eager: true})
      [count-1])

  it "toString", ->
    expect(Bacon.once(1).holdWhen(Bacon.constant(true)).toString()).to.equal(
      "Bacon.once(1).holdWhen(Bacon.constant(true))")


