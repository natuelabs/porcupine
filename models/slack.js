/**
 * Slack integration
 *
 * @constructor
 */
function Slack ( config ) {
  'use strict';

  this.config = config;
  this.request = require( 'request' );
  this.events = require( './events' );
  this.eventEmitter = require( './eventEmitter' );

  this.initEvents();
}

/**
 * Init events
 */
Slack.prototype.initEvents = function () {
  this.eventEmitter.on(
    this.events.slack.message.send,
    this.handleMessageSend.bind( this )
  );
};

/**
 * Process slack hooks
 *
 * @param req
 * @param res
 */
Slack.prototype.process = function ( req, res ) {
  if ( this.validateRequest( req ) === false ) {
    console.log( '[-->] Slack request is invalid' );
    res.json();

    return false;
  }

  var type = req.param( 'porcupine-event' );

  switch ( type ) {
    case 'command':
      /**
       * This event takes care of slack commands and the load will be:
       *
       * <code>
       *   token=xxx
       *   team_id=T0001
       *   team_domain=example
       *   channel_id=C2147483705
       *   channel_name=test
       *   user_id=U2147483697
       *   user_name=Steve
       *   command=/weather
       *   text=94070
       * </code>
       *
       * @see README.md
       */
      this.processCommand( req, res );
      break;
  }
};

/**
 * Validate request
 *
 * @param req
 */
Slack.prototype.validateRequest = function ( req ) {
  if ( this.config.token === undefined ) {
    console.log( '[-->] Slack security is not in use' );

    return true;
  }

  return req.body.token === this.config.token;
};

/**
 * Process command
 *
 * @param req
 * @param res
 */
Slack.prototype.processCommand = function ( req, res ) {
  var eventName = this.events.slack.command.called;

  /** @see events documentation */
  var data = {
    response : res,
    teamId : req.body.team_id,
    teamDomain : req.body.team_id,
    channelId : req.body.channel_id,
    channelName : req.body.channel_name,
    userId : req.body.user_id,
    userName : req.body.user_name,
    command : req.body.command,
    text : req.body.text
  };

  this.eventEmitter.emit( eventName, data );
};

/**
 * @see events documentation
 *
 * @param data
 */
Slack.prototype.handleMessageSend = function ( data ) {
  console.log( '[-->] Slack income hook' );

  if ( this.config.incomingHookUrl === undefined ) {
    console.log( '[-->] Slack incomingHookUrl is not defined' );

    return true;
  }

  var options = {
    url : this.config.incomingHookUrl,
    method : 'POST',
    form : { payload: JSON.stringify( data ) }
  };

  this.request( options );
};

module.exports = Slack;
