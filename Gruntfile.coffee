loadGruntTasks = require('load-grunt-tasks')

module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  grunt.initConfig(

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
