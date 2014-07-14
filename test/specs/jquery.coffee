Kefir = require('kefir')
helpers = require('../test-helpers.coffee')

{prop, watch, send, activate, withDOM} = helpers



if helpers.inBrowser

  $ = require('jquery')
  require('addons/kefir-jquery')



  describe '$.fn.asStream()', ->

    it '$() should have method named "asStream"', ->
      expect($([]).asStream).toBeDefined()
