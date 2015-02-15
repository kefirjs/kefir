var semver = require('semver');
var shell = require('shelljs');




module.exports = function(grunt){
  grunt.registerTask('post-release', 'cleanup repository after release', function(type){

    function run(cmd){
      if (shell.exec(cmd, {silent:false}).code === 0){
        grunt.log.ok(cmd + '   ...success');
      } else{
        grunt.fail.warn('Failed when executing: `' + cmd + '`\n')
      }
    }


    run('git rm -r dist');
    run('git rm -r bower-packages');
    run('git rm index.html');
    run('git rm test/in-browser/spec/KefirSpecs.js');
    run('git commit -m "cleanup repository after release"');
    run('git push');
  });
};

