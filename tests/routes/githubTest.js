'use strict';

var github = require( '../../routes/github' );
var consoleLog;

exports.testRouteGithub = {

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
    test.expect( 2 );

    var req = {
      test : true,
      app : {
        'get' : function () {
          return {
            github : {
              process : function ( testReq ) {
                test.strictEqual( testReq.test, true );
              }
            }
          };
        }
      }
    };

    var res = {
      json : function () {
        test.ok( true );
      }
    };

    github.post( req, res );

    test.done();
  },
};