webpack = require('webpack')
timeGrunt = require('time-grunt')
loadGruntTasks = require('load-grunt-tasks')


module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  banner = """
    /*! Kefir.js v#{pkg.version}
     *  #{pkg.homepage}
     */

  """

  timeGrunt(grunt)

  grunt.initConfig(

    browserify:
      tests:
        src: ['test/specs/*.js', 'test/specs/*.coffee']
        dest: 'test/in-browser/spec/KefirSpecs.js'
        options:
          transform: ['coffeeify']

    webpack:
      dev:
        entry: './src/index'
        output:
          path: 'dist'
          filename: 'kefir.js'
          library: 'Kefir'
          libraryTarget: 'umd'
        module:
          loaders: [
            {test: /\.js$/, loader: 'babel-loader'}
          ]
        plugins: [
          new webpack.BannerPlugin(banner, {raw: true, entryOnly: true})
        ]
      prod:
        entry: './src/index'
        output:
          path: 'dist'
          filename: 'kefir.min.js'
          library: 'Kefir'
          libraryTarget: 'umd'
        module:
          loaders: [
            {test: /\.js$/, loader: 'babel-loader'}
          ]
        plugins: [
          new webpack.BannerPlugin(banner, {raw: true, entryOnly: true}),
          new webpack.optimize.UglifyJsPlugin()
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

  loadGruntTasks(grunt)

  grunt.registerTask 'build-browser-tests', ['browserify:tests']
  grunt.registerTask 'build-kefir', ['webpack:dev', 'webpack:prod']
  grunt.registerTask 'build-docs', ['jade:docs']

  grunt.registerTask 'default', ['clean', 'build-docs', 'build-kefir', 'build-browser-tests']
