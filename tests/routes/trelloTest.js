'use strict';

var trello = require( '../../routes/trello' );
var consoleLog;

exports.testRouteTrello = {

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
   * head
   *
   * @param test
   */
  head : function ( test ) {
    test.expect( 1 );

    var req = { };
    var res = {
      json : function () {
        test.ok( true );
      }
    };

    trello.head( req, res );

    test.done();
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
            trello : {
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

    trello.post( req, res );

    test.done();
  },
};