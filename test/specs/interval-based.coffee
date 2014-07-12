Kefir = require('../../dist/kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, withFakeTime, activate} = helpers


describe '.withInterval()', ->

  it 'should create not ended property without value or error', ->
    withFakeTime (clock) ->
      p = activate(Kefir.withInterval(100, ->))
      expect(p).toNotBeEnded()
      expect(p).toHasNoValue()
      expect(p).toHasNoError()

  it 'should send events passed to `send`', ->
    withFakeTime (clock) ->
      toSend = [
        ['value', 1]
        ['nothing'],
        ['error', 'e1'],
        ['end']
      ]

      state = watch Kefir.withInterval 100, (send) ->
        event = toSend.shift()
        if event[0] == 'nothing'
          return
        send(event[0], event[1])

      clock.tick(1)
      expect(state).toEqual({values:[],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:['e1']})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:['e1'],end:undefined})

      clock.tick(1000)


  it 'should not call provided fn, or send anything when not active', ->
    withFakeTime (clock) ->

      callsCount = 0

      p = Kefir.withInterval 100, (send) ->
        callsCount++
        send('value', callsCount)

      expect(p).toNotBeActive()

      clock.tick(150)
      expect(callsCount).toBe(0)

      p.on 'value', (f = ->)
      expect(p).toBeActive()
      expect(callsCount).toBe(0)

      clock.tick(101)
      expect(callsCount).toBe(1)
      expect(p).toHasValue(1)

      clock.tick(100)
      expect(callsCount).toBe(2)
      expect(p).toHasValue(2)

      p.off 'value', f
      expect(p).toNotBeActive()

      clock.tick(150)
      expect(callsCount).toBe(2)
      expect(p).toHasValue(2)

      p.on 'value', f
      expect(p).toBeActive()
      expect(callsCount).toBe(2)

      clock.tick(101)
      expect(callsCount).toBe(3)
      expect(p).toHasValue(3)




describe '.fromPoll()', ->
  it 'should work', ->
    withFakeTime (clock) ->
      i = 0
      state = watch Kefir.fromPoll 100, -> ++i

      clock.tick(1)
      expect(state).toEqual({values:[],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1,2],errors:[]})




describe '.interval()', ->
  it 'should work', ->
    withFakeTime (clock) ->
      state = watch Kefir.interval 100, 1

      clock.tick(1)
      expect(state).toEqual({values:[],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1,1],errors:[]})




describe '.sequentially()', ->
  it 'should work', ->
    withFakeTime (clock) ->
      state = watch Kefir.sequentially 100, [1,2]

      clock.tick(1)
      expect(state).toEqual({values:[],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1,2],errors:[],end:undefined})

  it 'if empty array provided should end immediately', ->
    p = activate(Kefir.sequentially 100, [])
    expect(p).toBeEnded()



describe '.repeatedly()', ->
  it 'should work', ->
    withFakeTime (clock) ->
      state = watch Kefir.repeatedly 100, [1,2]

      clock.tick(1)
      expect(state).toEqual({values:[],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1,2],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1,2,1],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1,2,1,2],errors:[]})

  it 'if empty array provided should never produce values but not end', ->
    withFakeTime (clock) ->
      p = activate(Kefir.repeatedly 100, [])
      expect(p).toNotBeEnded()

      state = watch p
      clock.tick(1000)
      expect(state).toEqual({values:[],errors:[]})




describe '.later()', ->
  it 'should work', ->
    withFakeTime (clock) ->
      state = watch Kefir.later 100, 1

      clock.tick(1)
      expect(state).toEqual({values:[],errors:[]})

      clock.tick(100)
      expect(state).toEqual({values:[1],errors:[],end:undefined})
