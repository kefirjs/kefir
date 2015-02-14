# build-dependencies: skip, scheduled

describe "EventStream.zip", ->
  describe "pairwise combines values from two streams", ->
    expectStreamEvents(
      -> series(1, [1, 2, 3]).zip(series(1, ['a', 'b', 'c']))
      [[1, 'a'], [2, 'b'], [3, 'c']])
  describe "passes through errors", ->
    expectStreamEvents(
      -> series(2, [1, error(), 2]).zip(series(2, ['a', 'b']).delay(1))
      [[1, 'a'], error(), [2, 'b']])
  describe "completes as soon as possible", ->
    expectStreamEvents(
      -> series(1, [1]).zip(series(1, ['a', 'b', 'c']))
      [[1, 'a']])
  describe "can zip an observable with itself", ->
    expectStreamEvents(
      ->
        obs = series(1, ['a', 'b', 'c'])
        obs.zip(obs.skip(1))
      [['a', 'b'], ['b', 'c']])
  it "toString", ->
    expect(Bacon.never().zip(Bacon.once(1)).toString()).to.equal("Bacon.never().zip(Bacon.once(1))")

describe "Property.zip", ->
  describe "pairwise combines values from two properties", ->
    expectStreamEvents(
      -> series(1, [1, 2, 3]).toProperty().zip(series(1, ['a', 'b', 'c']).toProperty())
      [[1, 'a'], [2, 'b'], [3, 'c']], { unstable })

describe "Bacon.zipAsArray", ->
  describe "zips an array of streams into a stream of arrays", ->
    expectStreamEvents(
      ->
        obs = series(1, [1, 2, 3, 4])
        Bacon.zipAsArray([obs, obs.skip(1), obs.skip(2)])
    [[1 , 2 , 3], [2 , 3 , 4]])
  describe "supports n-ary syntax", ->
    expectStreamEvents(
      ->
        obs = series(1, [1, 2, 3, 4])
        Bacon.zipAsArray(obs, obs.skip(1))
    [[1 , 2], [2 , 3], [3, 4]])
  describe "accepts Properties as well as EventStreams", ->
    expectStreamEvents(
      ->
        obs = series(1, [1, 2, 3, 4])
        Bacon.zipAsArray(obs, obs.skip(1), Bacon.constant(5))
    [[1 , 2, 5]])
  describe "works with single stream", ->
    expectStreamEvents(
      ->
        obs = series(1, [1, 2])
        Bacon.zipAsArray([obs])
    [[1], [2]])
    expectStreamEvents(
      ->
        obs = series(1, [1, 2])
        Bacon.zipAsArray(obs)
    [[1], [2]])
  describe "works with 0 streams (=Bacon.never())", ->
    expectStreamEvents(
      -> Bacon.zipAsArray([])
      [])
    expectStreamEvents(
      -> Bacon.zipAsArray()
      [])
  it "toString", ->
    expect(Bacon.zipAsArray(Bacon.never(), Bacon.never()).toString()).to.equal("Bacon.zipAsArray(Bacon.never(),Bacon.never())")

describe "Bacon.zipWith", ->
  describe "zips an array of streams with given function", ->
    expectStreamEvents(
      ->
        obs = series(1, [1, 2, 3, 4])
        Bacon.zipWith([obs, obs.skip(1), obs.skip(2)], ((x,y,z) -> (x + y + z)))
    [1 + 2 + 3, 2 + 3 + 4])
  describe "supports n-ary syntax", ->
    expectStreamEvents(
      ->
        obs = series(1, [1, 2, 3, 4])
        f = ((x,y,z) -> (x + y + z))
        Bacon.zipWith(f, obs, obs.skip(1), obs.skip(2))
    [1 + 2 + 3, 2 + 3 + 4])
  describe "works with single stream", ->
    expectStreamEvents(
      ->
        obs = series(1, [1,2])
        f = (x) -> x * 2
        Bacon.zipWith(f, obs)
      [1 * 2, 2 * 2])
  describe "works with 0 streams (=Bacon.never())", ->
    expectStreamEvents(
      ->
        Bacon.zipWith([], ->)
      [])
    expectStreamEvents(
      ->
        Bacon.zipWith(->)
      [])
  it "toString", ->
    expect(Bacon.zipWith((->), Bacon.never()).toString()).to.equal("Bacon.zipWith(function,Bacon.never())")


