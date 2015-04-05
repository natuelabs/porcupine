'use strict';

var slack = require( '../../routes/slack' );
var consoleLog;

exports.testRouteSlack = {

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

    callback();
  },

  /**
   * post
   *
   * @param test
   */
  post : function ( test ) {
    test.expect( 1 );

    var req = {
      test : true,
      app : {
        'get' : function () {
          return {
            slack : {
              process : function ( testReq ) {
                test.strictEqual( testReq.test, true );
              }
            }
          };
        }
      }
    };

    slack.post( req, { } );

    test.done();
  },
};
