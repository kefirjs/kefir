module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  banner = """
    /*! #{pkg.name} - #{pkg.version} - <%= grunt.template.today("yyyy-mm-dd") %>
     *  #{pkg.homepage}
     *  License: #{pkg.license}
     *  Copyright (c) <%= grunt.template.today("yyyy") %> #{pkg.author}
     */

  """

  grunt.initConfig(

    browserify:
      tests:
        src: 'test/specs/*.js'
        dest: 'dist/test/specs.js'

    jasmine:
      main:
        src: []
        options:
          specs: 'dist/test/specs.js'
          outfile: 'dist/test/SpecRunner.html'

    uglify:
      kefir:
        options:
          banner: banner
        files:
          'dist/kefir.min.js': 'kefir.js'

    concat:
      kefir:
        options:
          banner: banner
        files:
          'dist/kefir.js': 'kefir.js'

    jasmine_node:
      main:
        options:
          specFolders: ["test/specs"]
          matchall: true

    jshint:
      options:
        jshintrc: true
      main: ['kefir.js', 'test/test-helpers.js', 'test/specs/*.js']


    watch:
      kefir:
        files: 'kefir.js'
        tasks: ['build-kefir']
      tests:
        files: ['kefir.js', 'test-helpers.js', 'specs/*.js']
        tasks: ['build-browser-tests']

    clean:
      main:
        src: ['.grunt', 'dist']

  )

  require("load-grunt-tasks")(grunt)

  grunt.registerTask 'build-browser-tests', ['browserify:tests', 'jasmine:main:build']
  grunt.registerTask 'build-kefir', ['concat:kefir', 'uglify:kefir']
  grunt.registerTask 'test', ['jasmine_node:main', 'jshint:main']
  grunt.registerTask 'default', ['clean', 'build-browser-tests', 'build-kefir', 'test']
