module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  banner = """
    /*! #{pkg.name} - #{pkg.version}
     *  #{pkg.homepage}
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
          'dist/kefir.min.js': 'src/kefir.js'

    concat:
      kefir:
        options:
          banner: banner
        files:
          'dist/kefir.js': 'src/kefir.js'

    jasmine_node:
      main:
        options:
          specFolders: ["test/specs"]
          matchall: true
          verbose: true

    jshint:
      options:
        jshintrc: true
      main: ['src/kefir.js', 'test/test-helpers.js', 'test/specs/*.js']


    watch:
      kefir:
        files: 'src/kefir.js'
        tasks: ['build-kefir']
      tests:
        files: ['kefir.js', 'test-helpers.js', 'specs/*.js']
        tasks: ['build-browser-tests']

    clean:
      main:
        src: ['.grunt', 'dist']

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

  grunt.registerTask 'build-browser-tests', ['browserify:tests', 'jasmine:main:build']
  grunt.registerTask 'build-kefir', ['concat:kefir', 'uglify:kefir']
  grunt.registerTask 'test', ['jasmine_node:main', 'jshint:main']
  grunt.registerTask 'release-patch', ['bump', 'release']
  grunt.registerTask 'default', ['clean', 'build-browser-tests', 'build-kefir', 'test']
