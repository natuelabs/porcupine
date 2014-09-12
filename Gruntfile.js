module.exports = function ( grunt ) {
  'use strict';

  grunt.initConfig( {
    pkg : grunt.file.readJSON( 'package.json' ),

    jshint : {
      /* https://github.com/gruntjs/grunt-contrib-jshint */
      all : [
        'Gruntfile.js',
        'porcupine.js',
        'routes/**/*.js',
        'models/**/*.js',
        'examples/**/*.js',
        'tests/**/*.js',
      ],
      options : {
        jshintrc : '.jshintrc',
      },
    },

    nodeunit : {
      /* https://github.com/gruntjs/grunt-contrib-nodeunit */
      tests : [ 'tests/**/*Test.js' ],
      options : {
        reporter : 'verbose',
      },
    },
  } );

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );

  grunt.registerTask( 'test', ['jshint', 'nodeunit'] );
};