{activate, deactivate, Kefir} = require('../test-helpers.coffee')


describe 'fromEvent', ->

  domTarget = ->
    addEventListener: (name, fn) ->
      this[name + 'Listener'] = fn
    removeEventListener: (name, fn) ->
      if this[name + 'Listener'] == fn
        delete this[name + 'Listener']

  nodeTarget = ->
    addListener: (name, fn) ->
      this[name + 'Listener'] = fn
    removeListener: (name, fn) ->
      if this[name + 'Listener'] == fn
        delete this[name + 'Listener']

  bindTarget = ->
    bind: (name, fn) ->
      this[name + 'Listener'] = fn
    unbind: (name, fn) ->
      if this[name + 'Listener'] == fn
        delete this[name + 'Listener']

  it 'should return stream', ->
    expect(Kefir.fromEvent(domTarget(), 'foo')).toBeStream()

  it 'should not be ended', ->
    expect(Kefir.fromEvent(domTarget(), 'foo')).toEmit []

  it 'should subscribe/unsubscribe from target', ->
    target = domTarget()
    a = Kefir.fromEvent(target, 'foo')
    expect(target.fooListener).toBeUndefined()
    activate(a)
    expect(target.fooListener).toEqual(jasmine.any(Function))
    deactivate(a)
    expect(target.fooListener).toBeUndefined()

    target = bindTarget()
    a = Kefir.fromEvent(target, 'foo')
    expect(target.fooListener).toBeUndefined()
    activate(a)
    expect(target.fooListener).toEqual(jasmine.any(Function))
    deactivate(a)
    expect(target.fooListener).toBeUndefined()

    target = nodeTarget()
    a = Kefir.fromEvent(target, 'foo')
    expect(target.fooListener).toBeUndefined()
    activate(a)
    expect(target.fooListener).toEqual(jasmine.any(Function))
    deactivate(a)
    expect(target.fooListener).toBeUndefined()


  it 'should emit values', ->
    target = domTarget()
    a = Kefir.fromEvent(target, 'foo')
    expect(a).toEmit [1, 2, 3], ->
      target.fooListener(1)
      target.fooListener(2)
      target.fooListener(3)

    target = nodeTarget()
    a = Kefir.fromEvent(target, 'foo')
    expect(a).toEmit [1, 2, 3], ->
      target.fooListener(1)
      target.fooListener(2)
      target.fooListener(3)

    target = bindTarget()
    a = Kefir.fromEvent(target, 'foo')
    expect(a).toEmit [1, 2, 3], ->
      target.fooListener(1)
      target.fooListener(2)
      target.fooListener(3)

  it 'should accept optional transformer and call it properly', ->
    target = domTarget()
    a = Kefir.fromEvent(target, 'foo', (a, b) -> [this, a, b])
    expect(a).toEmit [
      [{a: 1}, undefined, undefined]
      [{b: 1}, 1, undefined]
      [{c: 1}, 1, 2]
    ], ->
      target.fooListener.call({a:1})
      target.fooListener.call({b:1}, 1)
      target.fooListener.call({c:1}, 1, 2)

  it 'should accept optional transformer and call it properly (array fn)', ->
    target = domTarget()
    a = Kefir.fromEvent(target, 'foo', [((a, b) -> [this, a, b]), null, 0])
    expect(a).toEmit [
      [{a: 1}, 0, undefined]
      [{b: 1}, 0, 1]
      [{c: 1}, 0, 1]
    ], ->
      target.fooListener.call({a:1})
      target.fooListener.call({b:1}, 1)
      target.fooListener.call({c:1}, 1, 2)

  it 'should accept optional transformer and call it properly (array fn + context)', ->
    target = domTarget()
    a = Kefir.fromEvent(target, 'foo', [((a, b) -> [this, a, b]), {x:1}, 0])
    expect(a).toEmit [
      [{x: 1}, 0, undefined]
      [{x: 1}, 0, 1]
      [{x: 1}, 0, 1]
    ], ->
      target.fooListener.call({a:1})
      target.fooListener.call({b:1}, 1)
      target.fooListener.call({c:1}, 1, 2)
