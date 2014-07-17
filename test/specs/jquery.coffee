Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate, withDOM} = helpers



if helpers.inBrowser

  $ = require('jquery')
  require('addons/kefir-jquery')


  countListentrs = ($el, event, selector) ->
    # http://stackoverflow.com/questions/2518421/
    allListeners = $._data($el.get(0), "events")
    count = 0
    if allListeners?[event]?
      for listener in allListeners[event]
        if listener.selector == selector
          count++
    count


  describe 'jQuery addon', ->

    describe 'making sure test enviroment is ok', ->

      describe 'countListentrs()', ->

        it 'returns 0 when no listeners at all', ->
          withDOM (tmpDom) ->
            expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
            expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)

        it 'returns 0 when there is listeners but for different event', ->
          withDOM (tmpDom) ->
            $(tmpDom).on('mouseover', ->)
            expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
            expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)

        it 'returns 0 when there is listeners but for different selector', ->
          withDOM (tmpDom) ->
            $(tmpDom).on('click', '.bar', ->)
            expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
            expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)

        it 'returns right ammount of listeners', ->
          withDOM (tmpDom) ->
            $(tmpDom).on('mouseover', ->)
            $(tmpDom).on('click', ->)
            $(tmpDom).on('click', '.foo', ->)
            $(tmpDom).on('click', '.foo', ->)
            $(tmpDom).on('click', '.bar', ->)
            expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
            expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(2)
            $(tmpDom).off('click')
            expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
            expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)
            expect(  countListentrs($(tmpDom), 'mouseover')  ).toBe(1)

        it 'returns right ammount of listeners (custom events)', ->
          withDOM (tmpDom) ->
            $(tmpDom).on('kick', ->)
            $(tmpDom).on('lick', ->)
            $(tmpDom).on('lick', '.foo', ->)
            $(tmpDom).on('lick', '.foo', ->)
            $(tmpDom).on('lick', '.bar', ->)
            expect(  countListentrs($(tmpDom), 'lick')  ).toBe(1)
            expect(  countListentrs($(tmpDom), 'lick', '.foo')  ).toBe(2)
            $(tmpDom).off('lick')
            expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)
            expect(  countListentrs($(tmpDom), 'lick', '.foo')  ).toBe(0)
            expect(  countListentrs($(tmpDom), 'kick')  ).toBe(1)



      describe '$.fn.trigger()', ->

        it 'callback being called', ->
          withDOM (tmpDom) ->
            callCount = 0
            $(tmpDom).on('click', -> callCount++)
            expect(callCount).toBe(0)
            $(tmpDom).trigger('click')
            expect(callCount).toBe(1)
            $(tmpDom).trigger('click')
            expect(callCount).toBe(2)

        it 'callback being called (custom event)', ->
          withDOM (tmpDom) ->
            callCount = 0
            $(tmpDom).on('lick', -> callCount++)
            expect(callCount).toBe(0)
            $(tmpDom).trigger('lick')
            expect(callCount).toBe(1)
            $(tmpDom).trigger('lick')
            expect(callCount).toBe(2)

        it 'callback with selector being called', ->
          withDOM (tmpDom) ->
            callCount = 0
            $(tmpDom).on('click', '.foo', -> callCount++)

            $foo = $('<div class="foo"></div>').appendTo(tmpDom)
            expect(callCount).toBe(0)
            $foo.trigger('click')
            expect(callCount).toBe(1)
            $foo.trigger('click')
            expect(callCount).toBe(2)

            $bar = $('<div class="bar"></div>').appendTo(tmpDom)
            $bar.trigger('click')
            expect(callCount).toBe(2)

        it 'callback with selector being called (custom event)', ->
          withDOM (tmpDom) ->
            callCount = 0
            $(tmpDom).on('lick', '.foo', -> callCount++)

            $foo = $('<div class="foo"></div>').appendTo(tmpDom)
            expect(callCount).toBe(0)
            $foo.trigger('lick')
            expect(callCount).toBe(1)
            $foo.trigger('lick')
            expect(callCount).toBe(2)

            $bar = $('<div class="bar"></div>').appendTo(tmpDom)
            $bar.trigger('lick')
            expect(callCount).toBe(2)


    describe '$.fn.asStream()', ->

      it 'should add/remove jquery-listener on activation/deactivation', ->
        withDOM (tmpDom) ->
          clicks = $(tmpDom).asStream('click')
          licks = $(tmpDom).asStream('lick')

          f = ->
          f2 = ->

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          clicks.on 'value', f

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          licks.on 'value', f
          clicks.on 'value', f2

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(1)

          licks.off 'value', f

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          clicks.off 'value', f

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          clicks.off 'value', f2

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

      it 'should add/remove jquery-listener on activation/deactivation (with selector)', ->
        withDOM (tmpDom) ->
          clicks = $(tmpDom).asStream('click', '.foo')
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)
          clicks.on 'value', f = ->
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(1)
          clicks.off 'value', f
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)

      it 'should deliver events', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asStream('click').map (e) -> e.type  )
          $(tmpDom).trigger('click')
          expect(state).toEqual({values:['click'],errors:[]})
          $(tmpDom).trigger('click')
          expect(state).toEqual({values:['click', 'click'],errors:[]})

      it 'should deliver events (with selector)', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asStream('click', '.foo').map (e) -> e.type  )

          $foo = $('<div class="foo"></div>').appendTo(tmpDom)
          $foo.trigger('click')
          expect(state).toEqual({values:['click'],errors:[]})
          $foo.trigger('click')
          expect(state).toEqual({values:['click', 'click'],errors:[]})

          $bar = $('<div class="bar"></div>').appendTo(tmpDom)
          $bar.trigger('click')
          expect(state).toEqual({values:['click', 'click'],errors:[]})

      it 'should accept optional transformer fn', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asStream 'click', (e) -> e.type  )
          $(tmpDom).trigger('click')
          expect(state).toEqual({values:['click'],errors:[]})
          $(tmpDom).trigger('click')
          expect(state).toEqual({values:['click', 'click'],errors:[]})

      it 'should pass data to transformer', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asStream 'click', (e, data) -> data  )
          $(tmpDom).trigger('click', 1)
          expect(state).toEqual({values:[1],errors:[]})
          $(tmpDom).trigger('click', 2)
          expect(state).toEqual({values:[1, 2],errors:[]})


    describe '$.fn.asProperty()', ->

      it 'should throw when no getter fn provided', ->
        withDOM (tmpDom) ->

          expect(
            -> $(tmpDom).asProperty('click')
          ).toThrow()

          expect(
            -> $(tmpDom).asProperty('click', '.foo')
          ).toThrow()

          expect(
            -> $(tmpDom).asProperty('click', ->)
          ).not.toThrow()

          expect(
            -> $(tmpDom).asProperty('click', '.foo', ->)
          ).not.toThrow()

      it 'should get current value from getter on activation', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asProperty('click', -> 1)  )
          expect(state).toEqual({values:[1],errors:[]})

      it 'should add/remove jquery-listener on activation/deactivation', ->
        withDOM (tmpDom) ->
          clicks = $(tmpDom).asProperty('click', ->)
          licks = $(tmpDom).asProperty('lick', ->)

          f = ->
          f2 = ->

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          clicks.on 'value', f

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          licks.on 'value', f
          clicks.on 'value', f2

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(1)

          licks.off 'value', f

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          clicks.off 'value', f

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(1)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

          clicks.off 'value', f2

          expect(  countListentrs($(tmpDom), 'click')  ).toBe(0)
          expect(  countListentrs($(tmpDom), 'lick')  ).toBe(0)

      it 'should add/remove jquery-listener on activation/deactivation (with selector)', ->
        withDOM (tmpDom) ->
          clicks = $(tmpDom).asProperty('click', '.foo', ->)
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)
          clicks.on 'value', f = ->
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(1)
          clicks.off 'value', f
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)

      it 'should deliver events', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asProperty('click', (el, e) -> e?.type or 1)  )
          $(tmpDom).trigger('click')
          expect(state).toEqual({values:[1,'click'],errors:[]})
          $(tmpDom).trigger('click')
          expect(state).toEqual({values:[1,'click', 'click'],errors:[]})

      it 'should deliver events (with selector)', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asProperty('click', '.foo', (el, e) -> e?.type or 1)  )

          $foo = $('<div class="foo"></div>').appendTo(tmpDom)
          $foo.trigger('click')
          expect(state).toEqual({values:[1,'click'],errors:[]})
          $foo.trigger('click')
          expect(state).toEqual({values:[1,'click', 'click'],errors:[]})

          $bar = $('<div class="bar"></div>').appendTo(tmpDom)
          $bar.trigger('click')
          expect(state).toEqual({values:[1,'click', 'click'],errors:[]})

      it 'should pass data to getter', ->
        withDOM (tmpDom) ->
          state = watch(  $(tmpDom).asProperty 'click', (el, e, data) -> data or 0  )
          $(tmpDom).trigger('click', 1)
          expect(state).toEqual({values:[0, 1],errors:[]})
          $(tmpDom).trigger('click', 2)
          expect(state).toEqual({values:[0, 1, 2],errors:[]})
