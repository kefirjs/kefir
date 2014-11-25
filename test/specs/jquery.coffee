{withDOM, inBrowser, Kefir} = require('../test-helpers.coffee')




if !inBrowser

  console.log('Skipping jQuery specs in not browser enviroment ...')

else

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


    describe '$.fn.asKefirStream()', ->

      it 'should return stream', ->
        withDOM (tmpDom) ->
          expect($(tmpDom).asKefirStream('click')).toBeStream()



      it 'should add/remove jquery-listener on activation/deactivation', ->
        withDOM (tmpDom) ->
          clicks = $(tmpDom).asKefirStream('click')
          licks = $(tmpDom).asKefirStream('lick')

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
          clicks = $(tmpDom).asKefirStream('click', '.foo')
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)
          clicks.on 'value', f = ->
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(1)
          clicks.off 'value', f
          expect(  countListentrs($(tmpDom), 'click', '.foo')  ).toBe(0)

      it 'should deliver events', ->
        withDOM (tmpDom) ->
          expect(
            $(tmpDom).asKefirStream('click').map (e) -> e.type
          ).toEmit ['click', 'click'], ->
            $(tmpDom).trigger('click').trigger('click')


      it 'should deliver events (with selector)', ->
        withDOM (tmpDom) ->
          expect(
            $(tmpDom).asKefirStream('click', '.foo').map (e) -> $(e.target).attr('class')
          ).toEmit ['foo', 'foo', 'foo bar'], ->

            $foo = $('<div class="foo"></div>').appendTo(tmpDom)
            $foo.trigger('click').trigger('click')

            $bar = $('<div class="foo bar"></div>').appendTo(tmpDom)
            $bar.trigger('click')

            $bar.removeClass('foo')
            $bar.trigger('click')


      it 'should accept optional transformer fn', ->
        withDOM (tmpDom) ->
          expect(
            $(tmpDom).asKefirStream 'click', (e) -> e.type
          ).toEmit ['click', 'click'], ->
            $(tmpDom).trigger('click').trigger('click')

      it 'should pass data to transformer', ->
        withDOM (tmpDom) ->
          expect(
            $(tmpDom).asKefirStream 'click', (e, data) -> data
          ).toEmit [1, 2], ->
            $(tmpDom).trigger('click', 1).trigger('click', 2)

      it 'should call transformer with correct this context', ->
        withDOM (tmpDom) ->
          expect(
            $(tmpDom).asKefirStream 'click', (e) -> e.currentTarget == this
          ).toEmit [true, true], ->
            $(tmpDom).trigger('click').trigger('click')


    describe '$.fn.asKefirProperty()', ->
      it 'should return property', ->
        withDOM (tmpDom) ->
          expect($(tmpDom).asKefirProperty('click', ->)).toBeProperty()

      it 'should throw if no getter provided', ->
        withDOM (tmpDom) ->
          expect(  -> $(tmpDom).asKefirProperty('click')  ).toThrow()
          expect(  -> $(tmpDom).asKefirProperty('click', '.foo')  ).toThrow()

      it 'should call getter immediately after creation (without event)', ->
        withDOM (tmpDom) ->
          count = 0
          $(tmpDom).asKefirProperty 'click', (event) ->
            if event == undefined
              count++
          expect(count).toBe(1)

      it 'should has current value returned by getter', ->
        withDOM (tmpDom) ->
          expect($(tmpDom).asKefirProperty 'click', -> 0).toEmit [{current: 0}]

      it 'should handle events', ->
        withDOM (tmpDom) ->
          i = 0
          expect(
            $(tmpDom).asKefirProperty 'click', (event, data) ->
              if !event
                0
              else
                if event.type == 'click' && event.currentTarget == this
                  data
                else
                  -1
          ).toEmit [{current: 0}, 1, 2], ->
            $(tmpDom).trigger('click', 1).trigger('click', 2)




