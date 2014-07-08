Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send} = helpers


describe 'new Property()', ->

  it 'should has no value if created without initial', ->
    expect(prop()).toHasNoValue()

  it 'should has initial if created with initial', ->
    expect(prop(1)).toHasValue(1)

  it 'should has no error if created without initial error', ->
    expect(prop()).toHasNoError()

  it 'should has error if created with error', ->
    expect(prop(null, 1)).toHasError(1)

  it 'should not be ended', ->
    expect(prop()).toNotBeEnded()

  it 'should not be active', ->
    expect(prop()).toNotBeActive()



describe 'Property end:', ->

  it 'should end when `end` sent', ->
    p = prop()
    send(p, 'end')
    expect(p).toBeEnded()

  it 'should call `end` subscribers on end', ->
    p = prop()
    p.on 'end', (f = jasmine.createSpy())
    send(p, 'end')
    expect(f.calls.length).toBe(1)

  it 'should not call `end` subscribers after end', ->
    p = prop()
    send(p, 'end')
    p.on 'end', (f = jasmine.createSpy())
    expect(f.calls.length).toBe(0)

  it 'should call `end` subscribers after end (if subscr. via watch)', ->
    p = prop()
    send(p, 'end')
    p.watch 'end', (f = jasmine.createSpy())
    expect(f.calls.length).toBe(1)

  it 'should deactivate on end', ->
    p = prop()
    p.on 'value', ->
    send(p, 'end')
    expect(p).toNotBeActive()

  it 'should still deliver current *value* after end to new listeners', ->
    p = prop(1)
    send(p, 'end')
    v = null
    p.watch 'value', (x) -> v = x
    expect(v).toBe(1)

  it 'should still deliver current *error* after end to new listeners', ->
    p = prop(null, 1)
    send(p, 'end')
    v = null
    p.watch 'error', (x) -> v = x
    expect(v).toBe(1)

  it 'should stop deliver new *values* after end', ->
    p = prop(1)
    state = watch(p)
    send(p, 'value', 2)
    send(p, 'end')
    send(p, 'value', 3)
    expect(state).toEqual({values:[1,2],errors:[],ended:true})

  it 'should stop deliver new *errors* after end', ->
    p = prop(null, 1)
    state = watch(p)
    send(p, 'error', 2)
    send(p, 'end')
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2],ended:true})


describe 'Property active state:', ->

  it 'should activate when first `value` listener added', ->
    p = prop()
    p.on 'value', ->
    expect(p).toBeActive()

  it 'should activate when first `error` listener added', ->
    p = prop()
    p.on 'error', ->
    expect(p).toBeActive()

  it 'should activate when first `both` listener added', ->
    p = prop()
    p.on 'both', ->
    expect(p).toBeActive()

  it 'should *not* activate when `end` listener added', ->
    p = prop()
    p.on 'end', ->
    expect(p).toNotBeActive()

  it 'should deactivate when, and only when, all listener removed (value)', ->
    p = prop()
    p.on 'value', (f1 = ->)
    p.on 'value', (f2 = ->)
    p.off 'value', f1
    expect(p).toBeActive()
    p.off 'value', f2
    expect(p).toNotBeActive()

  it 'should deactivate when, and only when, all listener removed (error)', ->
    p = prop()
    p.on 'error', (f1 = ->)
    p.on 'error', (f2 = ->)
    p.off 'error', f1
    expect(p).toBeActive()
    p.off 'error', f2
    expect(p).toNotBeActive()

  it 'should deactivate when, and only when, all listener removed (both)', ->
    p = prop()
    p.on 'both', (f1 = ->)
    p.on 'both', (f2 = ->)
    p.off 'both', f1
    expect(p).toBeActive()
    p.off 'both', f2
    expect(p).toNotBeActive()

  it 'should deactivate when, and only when, all listener removed (value + error + both)', ->
    p = prop()
    p.on 'value', (f1 = ->)
    p.on 'error', (f2 = ->)
    p.on 'both', (f3 = ->)
    p.off 'value', f1
    expect(p).toBeActive()
    p.off 'error', f2
    expect(p).toBeActive()
    p.off 'both', f3
    expect(p).toNotBeActive()

  it 'should activate when first `value` listener added (via `watch`)', ->
    p = prop()
    p.watch 'value', ->
    expect(p).toBeActive()

  it 'should activate when first `error` listener added (via `watch`)', ->
    p = prop()
    p.watch 'error', ->
    expect(p).toBeActive()

  it 'should activate when first `both` listener added (via `watch`)', ->
    p = prop()
    p.watch 'both', ->
    expect(p).toBeActive()



describe 'Property initial value/error:', ->

  it 'should deliver initial *value* to listener added via `watch`', ->
    v = null
    p = prop(1)
    p.watch 'value', (x) -> v = x
    expect(v).toBe(1)

  it 'should deliver initial *error* to listener added via `watch`', ->
    v = null
    p = prop(null, 1)
    p.watch 'error', (x) -> v = x
    expect(v).toBe(1)

  it 'should deliver initial *value* to `both` listener added via `watch`', ->
    v = null
    p = prop(1)
    p.watch 'both', (type, x) ->
      expect(type).toBe('value')
      v = x
    expect(v).toBe(1)

  it 'should deliver initial *error* to `both` listener added via `watch`', ->
    v = null
    p = prop(null, 1)
    p.watch 'both', (type, x) ->
      expect(type).toBe('error')
      v = x
    expect(v).toBe(1)

  it 'should deliver initial *error* and *value* to `both` listener added via `watch`', ->
    v = null
    e = null
    p = prop(1, 2)
    p.watch 'both', (type, x) ->
      if type == 'value'
        v = x
      if type == 'error'
        e = x
    expect(v).toBe(1)
    expect(e).toBe(2)

  it 'should *not* deliver initial *value* to listener added via `on`', ->
    v = null
    p = prop(1)
    p.on 'value', (x) -> v = x
    expect(v).toBe(null)

  it 'should *not* deliver initial *error* to listener added via `on`', ->
    v = null
    p = prop(null, 1)
    p.on 'error', (x) -> v = x
    expect(v).toBe(null)

  it 'should *not* deliver initial *value* to `both` listener added via `on`', ->
    v = null
    p = prop(1)
    p.on 'both', (type, x) ->
      expect(type).toBe('value')
      v = x
    expect(v).toBe(null)

  it 'should *not* deliver initial *error* to `both` listener added via `on`', ->
    v = null
    p = prop(null, 1)
    p.on 'both', (type, x) ->
      expect(type).toBe('error')
      v = x
    expect(v).toBe(null)

  it 'should call watch callbacks with proper isInitial param (both)', ->
    log = []
    p = prop(1, 'e1')
    p.watch 'both', (type, x, isInitial) ->
      log.push [type, x, isInitial]
    send(p, 'value', 2)
    send(p, 'error', 'e2')
    expect(log).toEqual([
      ['value', 1, true]
      ['error', 'e1', true]
      ['value', 2, undefined]
      ['error', 'e2', undefined]
    ])

  it 'should call watch callbacks with proper isInitial param (value)', ->
    log = []
    p = prop(1)
    p.watch 'value', (x, isInitial) ->
      log.push [x, isInitial]
    send(p, 'value', 2)
    expect(log).toEqual([
      [1, true]
      [2, undefined]
    ])

  it 'should call watch callbacks with proper isInitial param (error)', ->
    log = []
    p = prop(null, 1)
    p.watch 'error', (x, isInitial) ->
      log.push [x, isInitial]
    send(p, 'error', 2)
    expect(log).toEqual([
      [1, true]
      [2, undefined]
    ])

  it '.has() should always return false for anything except `value` and `error`', ->
    p = prop()
    expect(p.has('foo')).toBe(false)
    expect(p.has('end')).toBe(false)
    send(p, 'end')
    expect(p.has('end')).toBe(false)

  it '.get(name, fallback) should return `fallback` if .has() returns false', ->
    p = prop()
    expect(p.get('value')).toBe(undefined)
    expect(p.get('value', 1)).toBe(1)
    expect(p.get('foo')).toBe(undefined)
    expect(p.get('foo', 1)).toBe(1)




describe 'Property value/error changes:', ->

  it 'value should change when property *not* active', ->
    p = prop(1)
    send(p, 'value', 2)
    expect(p).toHasValue(2)

  it 'value should change when property active', ->
    p = prop(1)
    p.on 'value', ->
    send(p, 'value', 2)
    expect(p).toHasValue(2)

  it 'value should *not* change when property ended', ->
    p = prop(1)
    send(p, 'end')
    send(p, 'value', 2)
    expect(p).toHasValue(1)

  it 'error should change when property *not* active', ->
    p = prop(null, 1)
    send(p, 'error', 2)
    expect(p).toHasError(2)

  it 'error should change when property active', ->
    p = prop(null, 1)
    p.on 'error', ->
    send(p, 'error', 2)
    expect(p).toHasError(2)

  it 'error should *not* change when property ended', ->
    p = prop(null, 1)
    send(p, 'end')
    send(p, 'error', 2)
    expect(p).toHasError(1)



describe 'Property listeners', ->

  it 'should get new values', ->
    p = prop()
    log = []
    p.on 'value', (x) -> log.push(x)
    send(p, 'value', 1)
    expect(log).toEqual([1])
    send(p, 'value', 2)
    expect(log).toEqual([1, 2])

  it 'should get new errors', ->
    p = prop()
    log = []
    p.on 'error', (x) -> log.push(x)
    send(p, 'error', 1)
    expect(log).toEqual([1])
    send(p, 'error', 2)
    expect(log).toEqual([1, 2])

  it 'should get new values and error when subscribed as `both`', ->
    p = prop()
    log = {
      value: [],
      error: []
    }
    p.on 'both', (type, x) -> log[type].push(x)
    send(p, 'value', 1)
    expect(log).toEqual({value:[1],error:[]})
    send(p, 'error', 1)
    expect(log).toEqual({value:[1],error:[1]})
    send(p, 'value', 2)
    expect(log).toEqual({value:[1, 2],error:[1]})
    send(p, 'error', 2)
    expect(log).toEqual({value:[1, 2],error:[1, 2]})




describe 'Property listener with context and/or args:', ->

  it 'listener should be called with specified context', ->
    p = prop()
    log = []
    obj = {
      name: 'foo',
      getName: -> log.push @name
    }
    p.on 'value', [obj.getName, obj]
    send(p, 'value', 1)
    expect(log).toEqual(['foo'])

  it 'listener should be called with specified args', ->
    p = prop()
    log = []
    obj = {
      name: 'foo',
      getName: (a, b, c) -> log.push(@name + a + b + c)
    }
    p.on 'value', [obj.getName, obj, 'b', 'a']
    send(p, 'value', 'r')
    expect(log).toEqual(['foobar'])

  it 'fn can be passed as string (name of method in context)', ->
    p = prop()
    log = []
    obj = {
      name: 'foo',
      getName: -> log.push @name
    }
    p.on 'value', ['getName', obj]
    send(p, 'value', 1)
    expect(log).toEqual(['foo'])
