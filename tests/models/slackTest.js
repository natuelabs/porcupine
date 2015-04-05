'use strict';

var Slack = require( '../../models/slack' );
var eventEmitter = require( '../../models/eventEmitter' );
var consoleLog;

exports.testModelSlack = {

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

    var handleMessageSend = Slack.prototype.handleMessageSend;

    Slack.prototype.handleMessageSend = function ( data ) {
      test.strictEqual( data.type, 'message.send' );
    };

    var slack = new Slack( {} );

    slack.eventEmitter.emit(
      slack.events.slack.message.send,
      { type : 'message.send' }
    );

    test.done();

    Slack.prototype.handleMessageSend = handleMessageSend;
  },

  /**
   * process method
   */
  process : {

    /**
     * process command
     *
     * @param test
     */
    command : function ( test ) {
      test.expect( 1 );

      var slack = new Slack( {} );
      var req = {
        'param' : function () {
          return 'command';
        },
        test : true
      };

      slack.validateRequest = function () {
        return true;
      };

      slack.processCommand = function ( req ) {
        test.strictEqual( req.test, true );
      };

      slack.process( req, { } );

      test.done();
    }
  },

  /**
   * validateRequest
   */
  validateRequest : {

    /**
     * validateRequest notSecure
     *
     * @param test
     */
    notSecure : function ( test ) {
      test.expect( 1 );

      var slack = new Slack( {} );

      test.strictEqual(
        slack.validateRequest( {} ),
        true
      );

      test.done();
    },

    /**
     * validateRequest invalidRequest
     *
     * @param test
     */
    invalidRequest : function ( test ) {
      test.expect( 1 );

      var slack = new Slack(
        {
          token : 'test'
        }
      );

      var req = {
        body : {
          token : 'wrong'
        }
      };

      test.equals(
        slack.validateRequest( req ),
        false
      );

      test.done();
    },

    /**
     * validateRequest validRequest
     *
     * @param test
     */
    validRequest : function ( test ) {
      test.expect( 1 );

      var slack = new Slack(
        {
          token : 'correct-token'
        }
      );

      var req = {
        body : {
          token : 'correct-token'
        }
      };

      test.equals(
        slack.validateRequest( req ),
        true
      );

      test.done();
    }
  },

  /**
   * processCommand method
   */
  processCommand :  function ( test ) {
    test.expect( 10 );

    var req = {
      body : {
        team_id : '123',
        team_domain : 'test.com',
        channel_id : '345',
        channel_name : 'test123',
        user_id : '789',
        user_name : 'Test Name',
        command : 'test-command',
        text : 'text'
      }
    };

    var slack = new Slack( {} );

    slack.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, slack.events.slack.command.called );
        test.strictEqual( data.response, 'response-test' );
        test.strictEqual( data.teamId, req.body.team_id );
        test.strictEqual( data.teamDomain, req.body.team_domain );
        test.strictEqual( data.channelId, req.body.channel_id );
        test.strictEqual( data.channelName, req.body.channel_name );
        test.strictEqual( data.userId, req.body.user_id );
        test.strictEqual( data.userName, req.body.user_name );
        test.strictEqual( data.command, req.body.command );
        test.strictEqual( data.text, req.body.text );
      }
    };

    slack.processCommand( req, 'response-test' );

    test.done();
  },

  /**
   * handleMessageSend method
   */
  handleMessageSend : {

    /**
     * handleMessageSend params
     *
     * @param test
     */
    params : function ( test ) {
      test.expect( 3 );

      var slack = new Slack( { incomingHookUrl : 'test-url' } );
      var dataTest = {
        test : 'test'
      };

      slack.request = function ( options ) {
        test.strictEqual( options.url, 'test-url' );
        test.strictEqual( options.method, 'POST' );
        test.strictEqual( options.form.payload, '{"test":"test"}' );
      };

      slack.handleMessageSend( dataTest );

      test.done();
    },

    /**
     * handleMessageSend noUrl
     *
     * @param test
     */
    noUrl : function ( test ) {
      test.expect( 1 );

      var slack = new Slack( { } );

      test.strictEqual( slack.handleMessageSend( { } ), true );

      test.done();
    }
  }
};
