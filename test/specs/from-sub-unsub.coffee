{activate, deactivate, Kefir} = require('../test-helpers.coffee')

noop = ->


describe 'fromSubUnsub', ->

  class Target

    constructor: ->
      @listener = null

    sub: (fn) =>
      @listener = fn

    unsub: (fn) =>
      @listener = null




  it 'should return stream', ->
    expect(Kefir.fromSubUnsub(noop, noop, noop)).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.fromSubUnsub(noop, noop, noop)).toEmit []

  it 'should subscribe/unsubscribe from target', ->
    target = new Target()
    a = Kefir.fromSubUnsub(target.sub, target.unsub)
    expect(target.listener).toBe(null)
    activate(a)
    expect(target.listener).toEqual(jasmine.any(Function))
    deactivate(a)
    expect(target.listener).toBe(null)


  it 'should emit values', ->
    target = new Target()
    a = Kefir.fromSubUnsub(target.sub, target.unsub)
    expect(a).toEmit [1, 2, 3], ->
      target.listener(1)
      target.listener(2)
      target.listener(3)


  it 'should accept optional transformer and call it properly', ->
    target = new Target()
    a = Kefir.fromSubUnsub(target.sub, target.unsub, (a, b) -> [this, a, b])
    expect(a).toEmit [
      [{a: 1}, undefined, undefined]
      [{b: 1}, 1, undefined]
      [{c: 1}, 1, 2]
    ], ->
      target.listener.call({a:1})
      target.listener.call({b:1}, 1)
      target.listener.call({c:1}, 1, 2)
