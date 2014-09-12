'use strict';

var Jenkins = require( '../../models/jenkins' );
var eventEmitter = require( '../../models/eventEmitter' );
var consoleLog;

exports.testModelJenkins = {

  /**
   * Set up the test
   *
   * @param done
   */
  setUp : function ( done ) {
    consoleLog = console.log;
    console.log = function () {
    };

    done();
  },

  /**
   * Tear down the test
   *
   * @param callback
   */
  tearDown : function ( callback ) {
    console.log = consoleLog;
    eventEmitter.removeAllListeners();

    callback();
  },

  /**
   * Events listeners
   *
   * @param test
   */
  events : function ( test ) {
    test.expect( 1 );

    var handleJobBuild = Jenkins.prototype.handleJobBuild;

    Jenkins.prototype.handleJobBuild = function ( data ) {
      test.strictEqual( data.type, 'job.build' );
    };

    var jenkins = new Jenkins( { } );

    jenkins.eventEmitter.emit(
      jenkins.events.jenkins.job.build,
      { type : 'job.build' }
    );

    test.done();

    Jenkins.prototype.handleJobBuild = handleJobBuild;
  },

  /**
   * callApi method
   */
  callApi : {

    /**
     * callApi success
     *
     * @param test
     */
    success : function ( test ) {
      test.expect( 2 );

      var jenkins = new Jenkins( { } );

      jenkins.request = function ( options, callback ) {
        callback(
          null,
          { statusCode : 200 },
          '{"success":true}'
        );
      };

      jenkins.callApi(
        'test',
        'post',
        { },
        function ( error, response ) {
          test.strictEqual( error, null );
          test.strictEqual( response, '{"success":true}' );
        }
      );

      test.done();
    },

    /**
     * callApi failure
     */
    failure : {

      /**
       * callApi failure error
       *
       * @param test
       */
      error : function ( test ) {
        test.expect( 2 );

        var jenkins = new Jenkins( { } );

        jenkins.request = function ( options, callback ) {
          callback(
            true,
            { statusCode : 200 },
            '{"success":false}'
          );
        };

        jenkins.callApi(
          'test',
          'post',
          { },
          function ( error, response ) {
            test.strictEqual( error, true );
            test.strictEqual( response, '{"success":false}' );
          }
        );

        test.done();
      },

      /**
       * callApi failure statusCode
       *
       * @param test
       */
      statusCode : function ( test ) {
        test.expect( 2 );

        var jenkins = new Jenkins( { } );

        jenkins.request = function ( options, callback ) {
          callback(
            null,
            { statusCode : 500 },
            '{"success":false}'
          );
        };

        jenkins.callApi(
          'test',
          'post',
          { },
          function ( error, response ) {
            test.strictEqual( error, true );
            test.strictEqual( response, '{"success":false}' );
          }
        );

        test.done();
      },
    },

    /**
     * callApi options
     *
     * @param test
     */
    options : function ( test ) {
      test.expect( 4 );

      var config = {
        baseUrl : 'http://test',
        user : 'userTest',
        key : 'passTest'
      };

      var auth = new Buffer( config.user + ':' + config.pass ).toString( 'base64' );

      var jenkins = new Jenkins( config );

      jenkins.request = function ( options ) {
        test.strictEqual( options.url, config.baseUrl + 'test' );
        test.strictEqual( options.method, 'post' );
        test.strictEqual( options.headers.Authorization, 'Basic ' + auth );
        test.strictEqual( options.form.test, true );
      };

      jenkins.callApi(
        'test',
        'post',
        { test : true },
        function () {
        }
      );

      test.done();
    },
  },

  /**
   * handleJobBuild method
   */
  handleJobBuild : {

    /**
     * handleJobBuild params
     *
     * @param test
     */
    params : function ( test ) {
      test.expect( 3 );

      var jenkins = new Jenkins( { } );
      var dataTest = {
        job : 'testJob',
        params : {
          test : true
        }
      };

      jenkins.callApi = function ( apiPath, method, data ) {
        test.strictEqual( apiPath, '/job/' + dataTest.job + '/buildWithParameters' );
        test.strictEqual( method, 'POST' );
        test.strictEqual( data.test, true );
      };

      jenkins.handleJobBuild( dataTest, function () {
      } );

      test.done();
    },

    /**
     * handleJobBuild noParams
     *
     * @param test
     */
    noParams : function ( test ) {
      test.expect( 3 );

      var jenkins = new Jenkins( { } );
      var dataTest = {
        job : 'testJob'
      };

      jenkins.callApi = function ( apiPath, method, data ) {
        test.strictEqual( apiPath, '/job/' + dataTest.job + '/build' );
        test.strictEqual( method, 'POST' );
        test.strictEqual( data, undefined );
      };

      jenkins.handleJobBuild( dataTest, function () {
      } );

      test.done();
    },
  },
};