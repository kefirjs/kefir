timeGrunt = require('time-grunt')
loadGruntTasks = require('load-grunt-tasks')

babel = require('rollup-plugin-babel')
uglify = require('rollup-plugin-uglify')
nodeResolve = require('rollup-plugin-node-resolve')
commonjs = require('rollup-plugin-commonjs')

module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  banner = """
    /*! Kefir.js v#{pkg.version}
     *  #{pkg.homepage}
     */

  """

  rollupPlugins = [
    babel({presets: ['es2015-loose-rollup']}),
    nodeResolve({main: true}),
    commonjs(),
  ]

  timeGrunt(grunt)

  grunt.initConfig(

    browserify:
      tests:
        src: ['test/specs/*.js', 'test/specs/*.coffee']
        dest: 'test/in-browser/spec/KefirSpecs.js'
        options:
          transform: [
            'coffeeify',
            ['babelify', {presets: ['es2015-loose'], only: /test\/specs\/.*\.js$/}],
          ]

    rollup:
      options:
        moduleName: 'Kefir'
        format: 'umd'
        banner: banner
      dev:
        options:
          plugins: rollupPlugins
        files:
          'dist/kefir.js': ['src/index.js']
      prod:
        options:
          sourceMap: true
          plugins: rollupPlugins.concat uglify(output: { comments: /\!\s\w/ })
        files:
          'dist/kefir.min.js': ['src/index.js']

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

    copy:
      flow:
        files: [
          {src:'kefir.js.flow', dest:'dist/'},
        ]

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

  loadGruntTasks(grunt)

  grunt.registerTask 'build-browser-tests', ['browserify:tests']
  grunt.registerTask 'build-kefir', ['rollup:dev', 'rollup:prod', 'copy:flow']
  grunt.registerTask 'build-docs', ['jade:docs']

  grunt.registerTask 'default', ['clean', 'build-docs', 'build-kefir', 'build-browser-tests']
