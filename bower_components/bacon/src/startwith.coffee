# build-dependencies: scan, concat

Bacon.Property :: startWith = (seed) ->
  withDescription(this, "startWith", seed,
    @scan(seed, (prev, next) -> next))

Bacon.EventStream :: startWith = (seed) ->
  withDescription(this, "startWith", seed,
    Bacon.once(seed).concat(this))
