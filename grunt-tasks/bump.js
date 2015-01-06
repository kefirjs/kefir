var semver = require('semver');
var shell = require('shelljs');




module.exports = function(grunt){
  grunt.registerTask('bump', 'bump version in package.json and bower.json', function(type){

    function run(cmd){
      if (shell.exec(cmd, {silent:false}).code === 0){
        grunt.log.ok(cmd + '   ...success');
      } else{
        grunt.fail.warn('Failed when executing: `' + cmd + '`\n')
      }
    }

    var pkg = grunt.file.readJSON('package.json');
    var bower = grunt.file.readJSON('bower.json');

    bower.version = pkg.version = semver.inc(pkg.version, type || 'patch');

    grunt.file.write('package.json', JSON.stringify(pkg, null, '  ') + '\n');
    grunt.log.ok('bumped version in package.json to ' + pkg.version);

    grunt.file.write('bower.json', JSON.stringify(bower, null, '  ') + '\n');
    grunt.log.ok('bumped version in bower.json to ' + pkg.version);

    run('NODE_PATH=./dist grunt'); // lol
    run('git add .');
    run('git add -f dist');
    run('git commit -m "'+ pkg.version +'"');
    run('git push');

  });
};

