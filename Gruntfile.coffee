module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  banner = """
    /*! Kefir.js v#{pkg.version}
     *  #{pkg.homepage}
     */

  """

  intro = """
    ;(function(global){
      "use strict";

      var Kefir = {};



  """

  outro = """


      if (typeof define === 'function' && define.amd) {
        define([], function() {
          return Kefir;
        });
        global.Kefir = Kefir;
      } else if (typeof module === "object" && typeof exports === "object") {
        module.exports = Kefir;
        Kefir.Kefir = Kefir;
      } else {
        global.Kefir = Kefir;
      }

    }(this));
  """

  require('time-grunt')(grunt)

  grunt.initConfig(

    browserify:
      tests:
        src: ['test/specs/*.js', 'test/specs/*.coffee']
        dest: 'test/in-browser/spec/KefirSpecs.js'
        options:
          transform: ['coffeeify']
      perf:
        expand: true
        cwd: "test/perf/perf-specs"
        src: "*.coffee"
        dest: "tmp/perf-bundles"
        ext: ".js"
        options:
          transform: ['coffeeify']

    uglify:
      kefir:
        options:
          banner: banner
          sourceMap: true
        files:
          'dist/kefir.min.js': 'dist/kefir.js'

    concat:
      kefir:
        options:
          banner: banner + intro
          footer: outro
        files:
          'dist/kefir.js': [
            'src/utils/*.js'
            'src/core.js'
            'src/*.js'
          ]

    jade:
      docs:
        options:
          data: {pkg}
          filters:
            escapehtml: (block) ->
              block
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
        files:
          'index.html': 'docs-src/index.jade'

    clean:
      main:
        src: ['dist', 'index.html']

    bower:
      install:
        options:
          cleanup: true
          verbose: true
          targetDir: './bower-packages'

  )

  require('load-grunt-tasks')(grunt)

  grunt.registerTask 'build-browser-tests', ['browserify:tests']
  grunt.registerTask 'build-kefir', ['concat:kefir', 'uglify:kefir']
  grunt.registerTask 'build-docs', ['jade:docs']



  grunt.registerTask 'default', ['clean', 'build-docs', 'build-kefir', 'build-browser-tests']


