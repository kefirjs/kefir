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

  )

  loadGruntTasks(grunt)
