Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate} = helpers



describe '.withHandler(echo)', ->

  echo = (send, type, x) -> send(type, x)

  it 'cur *value* of source should not became cur *value* of result', ->
    expect(  prop(1).withHandler(echo)  ).toHasNoValue()

  it 'cur *value* of source should became cur *value* of result after activation', ->
    expect(  activate(prop(1).withHandler(echo))  ).toHasValue(1)

  it 'cur *error* of source should not became cur *error* of result', ->
    expect(  prop(null, 1).withHandler(echo)  ).toHasNoError()

  it 'cur *error* of source should became cur *error* of result after activation', ->
    expect(  activate(prop(null, 1).withHandler(echo))  ).toHasError(1)

  it 'cur *end* of source should not became cur *end* of result', ->
    expect(  prop(null, null, 1).withHandler(echo)  ).toHasNoEnd()

  it 'cur *end* of source should became cur *end* of result after activation', ->
    expect(  activate(prop(null, null, 1).withHandler(echo))  ).toHasEnd(1)

  it 'deliver cur *value* to first listener', ->
    log = []
    logger = (a, b) -> log.push [a, b]
    p = prop(1).withHandler(echo)
    p.watch('value', logger)
    expect(log).toEqual([[1, true]])

  it 'deliver cur *error* to first listener', ->
    log = []
    logger = (a, b) -> log.push [a, b]
    p = prop(null, 1).withHandler(echo)
    p.watch('error', logger)
    expect(log).toEqual([[1, true]])

  it 'deliver cur *end* to first listener', ->
    log = []
    logger = (a, b) -> log.push [a, b]
    p = prop(null, null, 1).withHandler(echo)
    p.watch('end', logger)
    expect(log).toEqual([[1, true]])

  it 'deliver cur *value*, *error*, *end* to first "any" listener', ->
    log = []
    logger = (a, b, c) -> log.push [a, b, c]
    p = prop(1, 2, 3).withHandler(echo)
    p.watch('any', logger)
    expect(log).toEqual([['value', 1, true], ['error', 2, true], ['end', 3, true]])

  it 'should deliver further *value*, *error*, *end*', ->
    p = prop(1, 'a')
    state = watch(p.withHandler(echo))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    send(p, 'end', 'fin')
    expect(state).toEqual({values:[1,2,3],errors:['a','b','c'],end:'fin'})

  it 'should activate/deactivate source property', ->
    p = prop()
    mapped = p.withHandler(echo)
    expect(p).toNotBeActive()
    mapped.on 'value', (f = ->)
    expect(p).toBeActive()
    mapped.off 'value', f
    expect(p).toNotBeActive()







describe '.withHandler(skipCur)', ->

  skipCur = (send, type, x, isCur) -> isCur or send(type, x)

  it 'cur *value* of source should not became cur *value* of result', ->
    expect(  prop(1).withHandler(skipCur)  ).toHasNoValue()

  it 'cur *value* of source should not became cur *value* of result after activation', ->
    expect(  activate(prop(1).withHandler(skipCur))  ).toHasNoValue()

  it 'cur *error* of source should not became cur *error* of result', ->
    expect(  prop(null, 1).withHandler(skipCur)  ).toHasNoError()

  it 'cur *error* of source should not became cur *error* of result after activation', ->
    expect(  activate(prop(null, 1).withHandler(skipCur))  ).toHasNoError()

  it 'cur *end* of source should not became cur *end* of result', ->
    expect(  prop(null, null, 1).withHandler(skipCur)  ).toHasNoEnd()

  it 'cur *end* of source should not became cur *end* of result after activation', ->
    expect(  activate(prop(null, null, 1).withHandler(skipCur))  ).toHasNoEnd()

  it 'not deliver cur *value* to first listener', ->
    log = []
    logger = (a, b) -> log.push [a, b]
    p = prop(1).withHandler(skipCur)
    p.watch('value', logger)
    expect(log).toEqual([])

  it 'not deliver cur *error* to first listener', ->
    log = []
    logger = (a, b) -> log.push [a, b]
    p = prop(null, 1).withHandler(skipCur)
    p.watch('error', logger)
    expect(log).toEqual([])

  it 'not deliver cur *end* to first listener', ->
    log = []
    logger = (a, b) -> log.push [a, b]
    p = prop(null, null, 1).withHandler(skipCur)
    p.watch('end', logger)
    expect(log).toEqual([])

  it 'not deliver cur *value*, *error*, *end* to first "any" listener', ->
    log = []
    logger = (a, b, c) -> log.push [a, b, c]
    p = prop(1, 2, 3).withHandler(skipCur)
    p.watch('any', logger)
    expect(log).toEqual([])

  it 'should deliver further *value*, *error*, *end*', ->
    p = prop(1, 'a')
    state = watch(p.withHandler(skipCur))
    send(p, 'value', 2)
    send(p, 'error', 'b')
    send(p, 'value', 3)
    send(p, 'error', 'c')
    send(p, 'end', 'fin')
    expect(state).toEqual({values:[2,3],errors:['b','c'],end:'fin'})

  it 'should activate/deactivate source property', ->
    p = prop()
    mapped = p.withHandler(skipCur)
    expect(p).toNotBeActive()
    mapped.on 'value', (f = ->)
    expect(p).toBeActive()
    mapped.off 'value', f
    expect(p).toNotBeActive()
