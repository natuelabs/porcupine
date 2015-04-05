'use strict';

var jenkins = require( '../../routes/jenkins' );
var consoleLog;

exports.testRouteJenkins = {

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
            jenkins : {
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

    jenkins.post( req, res );

    test.done();
  },
};
