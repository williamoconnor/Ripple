module.exports = function(grunt) {
  grunt.initConfig ({
    sass: {
      dist: {
        files: {
          'client/stylesheets/style.css' : 'client/sass/app.scss',
          'client/stylesheets/login.css' : 'client/sass/login.scss'
        }
      }
    },
    watch: {
      source: {
        files: ['sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true, // needed to run LiveReload
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-sass');
  grunt.registerTask('default', ['sass']);
};