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

  it 'should not call `end` subscribers after end (on)', ->
    p = prop()
    send(p, 'end')
    p.on 'end', (f = jasmine.createSpy())
    expect(f.calls.length).toBe(0)

  it 'should call `end` subscribers after end (watch)', ->
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
    expect(state).toEqual({values:[1,2],errors:[],end:undefined})

  it 'should stop deliver new *errors* after end', ->
    p = prop(null, 1)
    state = watch(p)
    send(p, 'error', 2)
    send(p, 'end')
    send(p, 'error', 3)
    expect(state).toEqual({values:[],errors:[1,2],end:undefined})


describe 'Property active state:', ->

  it 'should activate when first `value` listener added', ->
    p = prop()
    p.on 'value', ->
    expect(p).toBeActive()

  it 'should activate when first `error` listener added', ->
    p = prop()
    p.on 'error', ->
    expect(p).toBeActive()

  it 'should activate when first `end` listener added', ->
    p = prop()
    p.on 'end', ->
    expect(p).toBeActive()

  it 'should activate when first `any` listener added', ->
    p = prop()
    p.on 'any', ->
    expect(p).toBeActive()

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

  it 'should deactivate when, and only when, all listener removed (end)', ->
    p = prop()
    p.on 'end', (f1 = ->)
    p.on 'end', (f2 = ->)
    p.off 'end', f1
    expect(p).toBeActive()
    p.off 'end', f2
    expect(p).toNotBeActive()

  it 'should deactivate when, and only when, all listener removed (any)', ->
    p = prop()
    p.on 'any', (f1 = ->)
    p.on 'any', (f2 = ->)
    p.off 'any', f1
    expect(p).toBeActive()
    p.off 'any', f2
    expect(p).toNotBeActive()

  it 'should deactivate when, and only when, all listener removed (value + error + end + any)', ->
    p = prop()
    p.on 'value', (f1 = ->)
    p.on 'error', (f2 = ->)
    p.on 'end', (f3 = ->)
    p.on 'any', (f4 = ->)
    p.off 'value', f1
    p.off 'error', f2
    p.off 'end', f3
    expect(p).toBeActive()
    p.off 'any', f4
    expect(p).toNotBeActive()

  it 'should activate when first `value` listener added (via `watch`)', ->
    p = prop()
    p.watch 'value', ->
    expect(p).toBeActive()

  it 'should activate when first `error` listener added (via `watch`)', ->
    p = prop()
    p.watch 'error', ->
    expect(p).toBeActive()

  it 'should activate when first `end` listener added (via `watch`)', ->
    p = prop()
    p.watch 'end', ->
    expect(p).toBeActive()

  it 'should activate when first `any` listener added (via `watch`)', ->
    p = prop()
    p.watch 'any', ->
    expect(p).toBeActive()



describe 'Property current value/error:', ->

  it 'should deliver current *value* to listener added via `watch`', ->
    v = null
    p = prop(1)
    p.watch 'value', (x) -> v = x
    expect(v).toBe(1)

  it 'should deliver current *error* to listener added via `watch`', ->
    v = null
    p = prop(null, 1)
    p.watch 'error', (x) -> v = x
    expect(v).toBe(1)

  it 'should deliver current *end* to listener added via `watch`', ->
    v = null
    p = prop(null, null, 1)
    p.watch 'end', (x) -> v = x
    expect(v).toBe(1)

  it 'should deliver current *value* to `any` listener added via `watch`', ->
    v = null
    p = prop(1)
    p.watch 'any', (type, x) ->
      expect(type).toBe('value')
      v = x
    expect(v).toBe(1)

  it 'should deliver current *error* to `any` listener added via `watch`', ->
    v = null
    p = prop(null, 1)
    p.watch 'any', (type, x) ->
      expect(type).toBe('error')
      v = x
    expect(v).toBe(1)

  it 'should deliver current *error*, *value*, *end* to `any` listener added via `watch`', ->
    v = null
    e = null
    en = null
    p = send(prop(1, 2), 'end', 3)
    p.watch 'any', (type, x) ->
      if type == 'value'
        v = x
      if type == 'error'
        e = x
      if type == 'end'
        en = x
    expect(v).toBe(1)
    expect(e).toBe(2)
    expect(en).toBe(3)

  it 'should *not* deliver current *value* to listener added via `on`', ->
    v = null
    p = prop(1)
    p.on 'value', (x) -> v = x
    expect(v).toBe(null)

  it 'should *not* deliver current *error* to listener added via `on`', ->
    v = null
    p = prop(null, 1)
    p.on 'error', (x) -> v = x
    expect(v).toBe(null)

  it 'should *not* deliver current *end* to listener added via `on`', ->
    v = null
    p = prop(null, null, 1)
    p.on 'end', (x) -> v = x
    expect(v).toBe(null)

  it 'should *not* deliver current *value* to `any` listener added via `on`', ->
    v = null
    p = prop(1)
    p.on 'any', (type, x) ->
      v = x
    expect(v).toBe(null)

  it 'should *not* deliver current *error* to `any` listener added via `on`', ->
    v = null
    p = prop(null, 1)
    p.on 'any', (type, x) ->
      v = x
    expect(v).toBe(null)

  it 'should *not* deliver current *end* to `any` listener added via `on`', ->
    v = null
    p = prop(null, null, 1)
    p.on 'any', (type, x) ->
      v = x
    expect(v).toBe(null)

  it 'should call watch callbacks with proper isCurrent param (any)', ->
    log = []
    p = prop(1, 'e1')
    p.watch 'any', (type, x, isCurrent) ->
      log.push [type, x, isCurrent]
    send(p, 'value', 2)
    send(p, 'error', 'e2')
    send(p, 'end', 'fin')
    expect(log).toEqual([
      ['value', 1, true]
      ['error', 'e1', true]
      ['value', 2, false]
      ['error', 'e2', false]
      ['end', 'fin', false]
    ])

  it 'should call watch callbacks with proper isCurrent param (value)', ->
    log = []
    p = prop(1)
    p.watch 'value', (x, isCurrent) ->
      log.push [x, isCurrent]
    send(p, 'value', 2)
    expect(log).toEqual([
      [1, true]
      [2, false]
    ])

  it 'should call watch callbacks with proper isCurrent param (error)', ->
    log = []
    p = prop(null, 1)
    p.watch 'error', (x, isCurrent) ->
      log.push [x, isCurrent]
    send(p, 'error', 2)
    expect(log).toEqual([
      [1, true]
      [2, false]
    ])

  it 'should call watch callbacks with proper isCurrent param (end:current)', ->
    log = []
    p = prop()
    send(p, 'end', 1)
    send(p, 'end', 2)
    p.watch 'end', (x, isCurrent) ->
      log.push [x, isCurrent]
    expect(log).toEqual([
      [1, true]
    ])

  it 'should call watch callbacks with proper isCurrent param (end:not-current)', ->
    log = []
    p = prop()
    p.watch 'end', (x, isCurrent) ->
      log.push [x, isCurrent]
    send(p, 'end', 1)
    expect(log).toEqual([
      [1, false]
    ])

  it '.has() should always return false for anything except `value`, `error`, `end`', ->
    p = prop()
    expect(p.has('foo')).toBe(false)

  it '.has() should return proper result for `value`, `error`, `end`', ->
    p = prop()
    expect(p.has('value')).toBe(false)
    expect(p.has('error')).toBe(false)
    expect(p.has('end')).toBe(false)
    send(p, 'value', 1)
    expect(p.has('value')).toBe(true)
    expect(p.has('error')).toBe(false)
    expect(p.has('end')).toBe(false)
    send(p, 'error', 1)
    expect(p.has('value')).toBe(true)
    expect(p.has('error')).toBe(true)
    expect(p.has('end')).toBe(false)
    send(p, 'end', 1)
    expect(p.has('value')).toBe(true)
    expect(p.has('error')).toBe(true)
    expect(p.has('end')).toBe(true)

  it '.get()  should return proper result for `value`, `error`, `end`', ->
    p = prop()
    expect(p.get('value')).toBe(undefined)
    expect(p.get('error')).toBe(undefined)
    expect(p.get('end')).toBe(undefined)
    send(p, 'value', 1)
    expect(p.get('value')).toBe(1)
    expect(p.get('error')).toBe(undefined)
    expect(p.get('end')).toBe(undefined)
    send(p, 'error', 2)
    expect(p.get('value')).toBe(1)
    expect(p.get('error')).toBe(2)
    expect(p.get('end')).toBe(undefined)
    send(p, 'end', 3)
    send(p, 'end', 4)
    expect(p.get('value')).toBe(1)
    expect(p.get('error')).toBe(2)
    expect(p.get('end')).toBe(3)

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

  it 'should get new ends', ->
    p = prop()
    log = []
    p.on 'end', (x) -> log.push(x)
    send(p, 'end', 1)
    expect(log).toEqual([1])
    send(p, 'end', 2)
    expect(log).toEqual([1])

  it 'should get new values, error, ends when subscribed as `any`', ->
    p = prop()
    log = {
      value: [],
      error: [],
      end: []
    }
    p.on 'any', (type, x) -> log[type].push(x)
    send(p, 'value', 1)
    expect(log).toEqual({value:[1],error:[],end:[]})
    send(p, 'error', 1)
    expect(log).toEqual({value:[1],error:[1],end:[]})
    send(p, 'value', 2)
    expect(log).toEqual({value:[1, 2],error:[1],end:[]})
    send(p, 'error', 2)
    expect(log).toEqual({value:[1, 2],error:[1, 2],end:[]})
    send(p, 'end', 3)
    expect(log).toEqual({value:[1, 2],error:[1, 2],end:[3]})
    send(p, 'end', 4)
    expect(log).toEqual({value:[1, 2],error:[1, 2],end:[3]})





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
