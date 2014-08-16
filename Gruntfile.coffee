module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  banner = """
    /*! #{pkg.name} - #{pkg.version}
     *  #{pkg.homepage}
     */

  """

  addonBanner = """
    /*! #{pkg.name} addon - #{pkg.version}
     *  #{pkg.homepage}
     */

  """

  intro = """
    ;(function(global){
      "use strict";


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

  grunt.initConfig(

    browserify:
      tests:
        src: ['test/specs/*.js', 'test/specs/*.coffee']
        dest: 'test/in-browser/spec/KefirSpecs.js'
        options:
          transform: ['coffeeify']

    uglify:
      kefir:
        options:
          banner: banner
          sourceMap: true
        files:
          'dist/kefir.min.js': 'dist/kefir.js'
      addons:
        options:
          banner: addonBanner
          sourceMap: true
        expand: true
        cwd: 'dist/addons'
        src: ['*.js', '!*.min.js']
        dest: 'dist/addons'
        ext: '.min.js'

    concat:
      kefir:
        options:
          banner: banner + intro
          footer: outro
        files:
          'dist/kefir.js': [
            'src/utils/utils.js'
            'src/utils/*.js'
            'src/core.js'
            'src/*.js'
          ]
      addons:
        options:
          banner: addonBanner
        expand: true
        cwd: 'addons'
        src: '*.js'
        dest: 'dist/addons'

    jasmine_node:
      main:
        options:
          specFolders: ["test/specs"]
          matchall: true
          verbose: true
          coffee: true

    jshint:
      options:
        jshintrc: true
      main: ['src/*.js']

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

    watch:
      kefir:
        files: 'src/*.js'
        tasks: ['build-kefir', 'build-browser-tests']
      addons:
        files: 'addons/*.js'
        tasks: ['build-addons', 'build-browser-tests']
      docs:
        files: 'docs-src/**/*'
        tasks: ['build-docs']
      tests:
        files: ['test/specs/*', 'test/test-helpers*']
        tasks: ['build-browser-tests']

    clean:
      main:
        src: ['dist', 'index.html']

    bower:
      install:
        options:
          cleanup: true
          verbose: true

    release:
      options:
        bump: false, # default: true
        # file: 'component.json', # default: package.json
        add: false, # default: true
        commit: false, # default: true
        # tag: false, # default: true
        push: false, # default: true
        # pushTags: false, # default: true
        # npm: false, # default: true
        # npmtag: true, # default: no tag
        # folder: 'folder/to/publish/to/npm', # default project root
        # tagName: 'some-tag-<%= version %>', # default: '<%= version %>'
        # commitMessage: 'check out my release <%= version %>', # default: 'release <%= version %>'
        # tagMessage: 'tagging version <%= version %>', # default: 'Version <%= version %>',
        # github:
        #   repo: 'pozadi/kefir', //put your user/repo here
        #   usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
        #   passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains Github password


  )

  require("load-grunt-tasks")(grunt)
  grunt.loadTasks("grunt-tasks")

  grunt.registerTask 'build-browser-tests', ['browserify:tests']
  grunt.registerTask 'build-kefir', ['concat:kefir', 'uglify:kefir']
  grunt.registerTask 'build-addons', ['concat:addons', 'uglify:addons']
  grunt.registerTask 'test', ['jasmine_node:main', 'jshint:main']
  grunt.registerTask 'build-docs', ['jade:docs']
  grunt.registerTask 'release-patch', ['bump', 'release']
  grunt.registerTask 'release-minor', ['bump:minor', 'release']
  grunt.registerTask 'release-major', ['bump:major', 'release']
  grunt.registerTask 'release-pre', ['bump:prerelease', 'release']
  grunt.registerTask 'default', [
    'clean', 'build-docs', 'build-kefir', 'build-addons', 'build-browser-tests', 'test']
